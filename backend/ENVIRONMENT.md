Environment variables and secrets (development)

This file explains how to generate and set secrets for local development.

JWT secret
----------

The application reads the JWT signing secret from the environment variable `APP_JWT_SECRET`.
This avoids committing secrets into the repository. If `APP_JWT_SECRET` is not set, the application
will fall back to the placeholder value in `application.properties` (only for local development).

Generate a secure random secret (Windows PowerShell)
--------------------------------------------------

Run the following in PowerShell to generate a 64-byte random secret and print it in Base64:

```powershell
$bytes = New-Object 'System.Byte[]' 64
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[System.Convert]::ToBase64String($bytes)
```

Copy the output string and set it as `APP_JWT_SECRET` before starting the app.

Set the environment variable (PowerShell)
----------------------------------------

Temporarily for the current terminal session:

```powershell
$env:APP_JWT_SECRET = '<PASTE-YOUR-BASE64-SECRET-HERE>'
./mvnw.cmd spring-boot:run
```

For persistent use (developer machine), set it in your user environment variables via System Settings or use PowerShell's `setx` (note: `setx` only applies to newly opened shells):

```powershell
setx APP_JWT_SECRET '<PASTE-YOUR-BASE64-SECRET-HERE>'
```

Important notes
---------------

- Rotate this secret if it has been committed to any remote repository.
- Do not store secrets directly in `application.properties` for production. Use environment variables or your cloud provider / CI secret store.
- Use your cloud provider or CI secret manager (GitHub Actions Secrets, Azure Key Vault, AWS Secrets Manager) to keep the secret out of source control.
