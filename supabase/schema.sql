-- ==================== LOCALSPACE DATABASE SCHEMA ====================
-- Version 2.0 - Con verificación de correo electrónico
-- Ejecutar en Supabase SQL Editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==================== USERS TABLE ====================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CLIENTE' CHECK (role IN ('CLIENTE', 'PROVEEDOR', 'ADMIN')),
    phone TEXT,
    avatar TEXT,
    bio TEXT,
    
    -- Email verification (manejado principalmente por Supabase Auth)
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMPTZ,
    
    -- Provider-specific fields
    verification_status TEXT CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    ine_document_url TEXT,
    company_name TEXT,
    company_rfc TEXT,
    bank_account TEXT,
    bank_name TEXT,
    
    -- Preferences
    preferences JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- ==================== VENUES TABLE ====================
CREATE TABLE IF NOT EXISTS public.venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    zone TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    category TEXT NOT NULL CHECK (category IN (
        'SALON_EVENTOS', 'JARDIN', 'TERRAZA', 'HACIENDA', 
        'BODEGA', 'RESTAURANTE', 'HOTEL', 'FINCA', 'ROOFTOP'
    )),
    price DECIMAL(10, 2) NOT NULL,
    price_per_person DECIMAL(10, 2),
    min_capacity INTEGER DEFAULT 10,
    max_capacity INTEGER NOT NULL,
    images TEXT[] DEFAULT '{}',
    payment_methods TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    rules TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN (
        'PENDING', 'ACTIVE', 'FEATURED', 'INACTIVE', 'BANNED'
    )),
    rating DECIMAL(2, 1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== VENUE EXTRAS ====================
CREATE TABLE IF NOT EXISTS public.venue_extras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== VENUE AVAILABILITY ====================
CREATE TABLE IF NOT EXISTS public.venue_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    special_price DECIMAL(10, 2),
    notes TEXT,
    UNIQUE(venue_id, date)
);

-- ==================== BOOKINGS TABLE ====================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    event_type TEXT,
    guest_count INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN (
        'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'
    )),
    base_price DECIMAL(10, 2) NOT NULL,
    extras_price DECIMAL(10, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('TRANSFERENCIA', 'EFECTIVO', 'TARJETA')),
    payment_status TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PARTIAL', 'PAID')),
    deposit_amount DECIMAL(10, 2),
    deposit_paid_at TIMESTAMPTZ,
    notes TEXT,
    provider_notes TEXT,
    extras JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancelled_by UUID REFERENCES public.users(id),
    cancellation_reason TEXT
);

-- ==================== REVIEWS TABLE ====================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images TEXT[] DEFAULT '{}',
    provider_response TEXT,
    response_at TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(booking_id)
);

-- ==================== FAVORITES TABLE ====================
CREATE TABLE IF NOT EXISTS public.favorites (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, venue_id)
);

-- ==================== CONVERSATIONS ====================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== CONVERSATION PARTICIPANTS ====================
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    unread_count INTEGER DEFAULT 0,
    last_read_at TIMESTAMPTZ,
    PRIMARY KEY (conversation_id, user_id)
);

-- ==================== MESSAGES TABLE ====================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== NOTIFICATIONS ====================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== FAQS ====================
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== RECENTLY VIEWED ====================
CREATE TABLE IF NOT EXISTS public.recently_viewed (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, venue_id)
);

-- ==================== TRIGGERS ====================

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role, avatar, email_verified)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'CLIENTE'),
        'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.email,
        NEW.email_confirmed_at IS NOT NULL
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update email_verified when confirmed
CREATE OR REPLACE FUNCTION public.handle_email_confirmed()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        UPDATE public.users 
        SET email_verified = TRUE, email_verified_at = NEW.email_confirmed_at
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update venue rating on new review
CREATE OR REPLACE FUNCTION public.update_venue_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.venues
    SET 
        rating = (SELECT AVG(rating)::DECIMAL(2,1) FROM public.reviews WHERE venue_id = NEW.venue_id),
        review_count = (SELECT COUNT(*) FROM public.reviews WHERE venue_id = NEW.venue_id)
    WHERE id = NEW.venue_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update favorites count
CREATE OR REPLACE FUNCTION public.update_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.venues SET favorites_count = favorites_count + 1 WHERE id = NEW.venue_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.venues SET favorites_count = favorites_count - 1 WHERE id = OLD.venue_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Block date when booking is confirmed
CREATE OR REPLACE FUNCTION public.block_date_on_booking()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'CONFIRMED' AND OLD.status != 'CONFIRMED' THEN
        INSERT INTO public.venue_availability (venue_id, date, is_available)
        VALUES (NEW.venue_id, NEW.event_date, FALSE)
        ON CONFLICT (venue_id, date) DO UPDATE SET is_available = FALSE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment venue views
CREATE OR REPLACE FUNCTION public.increment_venue_views(venue_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.venues SET views = views + 1 WHERE id = venue_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_email_confirmed ON auth.users;
CREATE TRIGGER on_email_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_email_confirmed();

DROP TRIGGER IF EXISTS on_review_created ON public.reviews;
CREATE TRIGGER on_review_created
    AFTER INSERT ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_venue_rating();

DROP TRIGGER IF EXISTS on_favorite_changed ON public.favorites;
CREATE TRIGGER on_favorite_changed
    AFTER INSERT OR DELETE ON public.favorites
    FOR EACH ROW EXECUTE FUNCTION public.update_favorites_count();

DROP TRIGGER IF EXISTS on_booking_confirmed ON public.bookings;
CREATE TRIGGER on_booking_confirmed
    AFTER UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.block_date_on_booking();

-- ==================== ROW LEVEL SECURITY ====================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users 
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users 
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Providers are publicly viewable" ON public.users 
    FOR SELECT USING (role = 'PROVEEDOR');

-- Venues policies
CREATE POLICY "Active venues are viewable by everyone" ON public.venues 
    FOR SELECT USING (status IN ('ACTIVE', 'FEATURED'));
CREATE POLICY "Providers can manage their venues" ON public.venues 
    FOR ALL USING (auth.uid() = provider_id);

-- Venue extras policies
CREATE POLICY "Extras are viewable if venue is viewable" ON public.venue_extras 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.venues WHERE id = venue_id AND status IN ('ACTIVE', 'FEATURED'))
    );
CREATE POLICY "Providers can manage their extras" ON public.venue_extras 
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.venues WHERE id = venue_id AND provider_id = auth.uid())
    );

-- Venue availability open for reading
CREATE POLICY "Venue availability is public" ON public.venue_availability
    FOR SELECT USING (true);
CREATE POLICY "Providers can manage availability" ON public.venue_availability
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.venues WHERE id = venue_id AND provider_id = auth.uid())
    );

-- Bookings policies
CREATE POLICY "Users can view their bookings" ON public.bookings 
    FOR SELECT USING (auth.uid() IN (client_id, provider_id));
CREATE POLICY "Clients can create bookings" ON public.bookings 
    FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Participants can update bookings" ON public.bookings 
    FOR UPDATE USING (auth.uid() IN (client_id, provider_id));

-- Reviews policies
CREATE POLICY "Reviews are publicly viewable" ON public.reviews 
    FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Providers can respond to reviews" ON public.reviews 
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.venues WHERE id = venue_id AND provider_id = auth.uid())
    );

-- Favorites policies
CREATE POLICY "Users can view their favorites" ON public.favorites 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their favorites" ON public.favorites 
    FOR ALL USING (auth.uid() = user_id);

-- FAQs policies
CREATE POLICY "FAQs are publicly viewable" ON public.faqs 
    FOR SELECT USING (is_active = true);

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON public.notifications 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON public.notifications 
    FOR UPDATE USING (auth.uid() = user_id);

-- Recently viewed policies
CREATE POLICY "Users can view their history" ON public.recently_viewed
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their history" ON public.recently_viewed
    FOR ALL USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can view their conversations" ON public.conversations
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = id AND user_id = auth.uid())
    );

CREATE POLICY "Users can view conversation participants" ON public.conversation_participants
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid())
    );

CREATE POLICY "Users can view messages in their conversations" ON public.messages
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can send messages in their conversations" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
    );

-- ==================== INDEXES ====================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_venues_provider ON public.venues(provider_id);
CREATE INDEX IF NOT EXISTS idx_venues_zone ON public.venues(zone);
CREATE INDEX IF NOT EXISTS idx_venues_category ON public.venues(category);
CREATE INDEX IF NOT EXISTS idx_venues_status ON public.venues(status);
CREATE INDEX IF NOT EXISTS idx_venues_rating ON public.venues(rating DESC);
CREATE INDEX IF NOT EXISTS idx_venues_price ON public.venues(price);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_venue ON public.reviews(venue_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_availability_venue_date ON public.venue_availability(venue_id, date);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_venues_search ON public.venues USING gin(
    to_tsvector('spanish', name || ' ' || COALESCE(description, '') || ' ' || address)
);
