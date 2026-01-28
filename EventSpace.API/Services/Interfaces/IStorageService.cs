namespace EventSpace.API.Services.Interfaces;

/// <summary>
/// Servicio de almacenamiento de archivos
/// Stub - La implementación la hará el compañero junto con la base de datos
/// </summary>
public interface IStorageService
{
    /// <summary>
    /// Sube una imagen y retorna la URL
    /// </summary>
    Task<string> UploadImageAsync(Stream fileStream, string fileName, string folder);

    /// <summary>
    /// Elimina una imagen por su URL
    /// </summary>
    Task DeleteImageAsync(string imageUrl);
}
