$url = "http://localhost:8080/api/shelters"
try {
    $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response:"
    Write-Host $response.Content
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}