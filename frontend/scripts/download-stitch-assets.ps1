# PowerShell script to download Stitch project assets for Project ID 1442164688615983645
# Replace the <URL> placeholders with the real hosted URLs from Stitch for each asset.

$assets = @(
    @{ id = 'asset-stub-assets-f5646b42d2034c668c7f9ff441eef00b-1774437154297'; name = 'logo.png'; url = '<URL for asset-stub-assets-f5646b42d2034c668c7f9ff441eef00b-1774437154297>' },
    @{ id = 'aaf7ebe3fb474cdea3e03396af5dc49f'; name = 'hero.jpg'; url = '<URL for aaf7ebe3fb474cdea3e03396af5dc49f>' },
    @{ id = '9633f033de21464f9bbda868b688d32a'; name = 'library.jpg'; url = '<URL for 9633f033de21464f9bbda868b688d32a>' },
    @{ id = '5daeda1ef40a407db38d5e01defff3b8'; name = 'album-detail.jpg'; url = '<URL for 5daeda1ef40a407db38d5e01defff3b8>' },
    @{ id = 'e26c1293fd434142b9bf236ed1252818'; name = 'friends.jpg'; url = '<URL for e26c1293fd434142b9bf236ed1252818>' }
)

$assetsDir = Join-Path -Path $PSScriptRoot -ChildPath "..\public\assets"
if (-Not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null
}

Write-Host "Downloading assets to: $assetsDir"

foreach ($a in $assets) {
    $out = Join-Path $assetsDir $a.name
    if ($a.url -like '<URL*') {
        Write-Host "Skipping $($a.id) - placeholder URL present. Please edit this script and set the actual URL for $($a.name)"
        continue
    }
    Write-Host "Downloading $($a.id) -> $out"
    # Use curl (PowerShell alias for Invoke-WebRequest) with -L to follow redirects; for larger files prefer Invoke-WebRequest
    curl -L $a.url -o $out
}

Write-Host "Done. If you have album covers for specific album IDs, place them in public/assets/albums/{id}.jpg"
