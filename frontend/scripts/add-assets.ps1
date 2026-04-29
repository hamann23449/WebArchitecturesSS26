# Copies the existing placeholder.png into named assets so you can replace them with JPGs
$assetsDir = Join-Path -Path $PSScriptRoot -ChildPath "..\public\assets"
$albumsDir = Join-Path $assetsDir "albums"
if (-Not (Test-Path $assetsDir)) { Write-Host "Assets directory not found: $assetsDir"; Exit 1 }
if (-Not (Test-Path $albumsDir)) { New-Item -ItemType Directory -Path $albumsDir -Force | Out-Null }
$placeholder = Join-Path $assetsDir "placeholder.png"
if (-Not (Test-Path $placeholder)) { Write-Host "placeholder.png not found at $placeholder. Place a placeholder image there first."; Exit 1 }

# Copy placeholder to design-system assets (extensions changed where desired)
Copy-Item -Path $placeholder -Destination (Join-Path $assetsDir "logo.png") -Force
Copy-Item -Path $placeholder -Destination (Join-Path $assetsDir "hero.jpg") -Force
Copy-Item -Path $placeholder -Destination (Join-Path $assetsDir "library.jpg") -Force

# Create a couple of album cover files so the UI shows thumbnails
Copy-Item -Path $placeholder -Destination (Join-Path $albumsDir "1.jpg") -Force
Copy-Item -Path $placeholder -Destination (Join-Path $albumsDir "2.jpg") -Force

Write-Host "Added logo.png, hero.jpg, library.jpg and albums/1.jpg, albums/2.jpg from placeholder.png. Replace with real images when ready."
