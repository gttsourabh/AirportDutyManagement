# Run this script AS ADMINISTRATOR to install OnePlus/OPPO ADB driver
# Right-click this file → "Run with PowerShell" and approve the UAC prompt

# Self-elevate if not already admin
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Start-Process PowerShell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    exit
}

Write-Host "Running as Administrator - Installing OnePlus ADB driver..." -ForegroundColor Green

$infPath = "C:\Android\sdk\extras\google\usb_driver\android_winusb.inf"
$infContent = Get-Content $infPath -Raw

# Add OnePlus/OPPO (VID_22D9) entries if not already present
if ($infContent -notmatch 'VID_22D9') {
    Write-Host "Adding OnePlus entries to driver INF..." -ForegroundColor Yellow

    $oneplusX86 = @"

;OnePlus / OPPO devices (VID_22D9)
%CompositeAdbInterface%     = USB_Install, USB\VID_22D9&PID_2763&MI_01
%CompositeAdbInterface%     = USB_Install, USB\VID_22D9&PID_2764&MI_01
%CompositeAdbInterface%     = USB_Install, USB\VID_22D9&PID_2765&MI_01
%CompositeAdbInterface%     = USB_Install, USB\VID_22D9&PID_2766&MI_02
%CompositeAdbInterface%     = USB_Install, USB\VID_22D9&PID_2767&MI_01
%CompositeAdbInterface%     = USB_Install, USB\VID_22D9&PID_2769&MI_01
%SingleAdbInterface%        = USB_Install, USB\VID_22D9&PID_2775
%CompositeAdbInterface%     = USB_Install, USB\VID_22D9&PID_2776&MI_01

"@

    # Insert into both NTx86 and NTamd64 sections (before [USB_Install])
    $infContent = $infContent -replace '(\[USB_Install\])', "$oneplusX86`$1"
    Set-Content $infPath $infContent -Encoding ASCII
    Write-Host "OnePlus entries added." -ForegroundColor Green
}

# Kill ADB server first
Write-Host "Stopping ADB server..." -ForegroundColor Yellow
& "C:\Users\Admin\platform-tools\adb.exe" kill-server 2>$null
Start-Sleep -Seconds 1

# Install the driver
Write-Host "Installing driver (pnputil)..." -ForegroundColor Yellow
$result = & pnputil /add-driver $infPath /install 2>&1
Write-Host $result

# Update drivers for known OnePlus hardware IDs
$hwIds = @(
    "USB\VID_22D9&PID_2765&MI_01",
    "USB\VID_22D9&PID_2766&MI_02"
)

foreach ($hwId in $hwIds) {
    Write-Host "Updating driver for $hwId..." -ForegroundColor Yellow
    $result = & pnputil /scan-devices 2>&1
}

# Restart ADB
Write-Host "Starting ADB server..." -ForegroundColor Yellow
& "C:\Users\Admin\platform-tools\adb.exe" start-server
Start-Sleep -Seconds 2
$devices = & "C:\Users\Admin\platform-tools\adb.exe" devices 2>&1
Write-Host "Connected devices:" -ForegroundColor Cyan
Write-Host $devices

Write-Host "`nDone! If your OnePlus still does not appear:" -ForegroundColor Green
Write-Host "1. Disconnect and reconnect the USB cable" -ForegroundColor White
Write-Host "2. On phone: tap 'Revoke USB debugging authorizations' then re-enable USB Debugging" -ForegroundColor White
Write-Host "3. Check that USB mode is set to 'File Transfer (MTP)' not 'Charging only'" -ForegroundColor White

Read-Host "`nPress Enter to close"
