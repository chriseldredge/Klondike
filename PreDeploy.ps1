function Add-WindowsDebuggers
{
	param(
		[string] $version,
		[string] $downloadUrl
	)

	Write-Host "Installing Windows Debuggers $version, using the Windows SDK installer"

	$currentVersion = gwmi win32_product | where { $_.Name -match "SDK Debuggers" } | select -First 1 | Select -ExpandProperty "version"
	Write-Host "  - Current version"$currentVersion

	if (!($currentVersion -ge $version))
	{
		$downloadFilename = "sdksetup.exe"
		$downloadToExe = "$PWD\"+$downloadFilename

		Write-Host "  - $version not installed, downloading from $downloadUrl..."
		(New-Object System.Net.WebClient).DownloadFile($downloadUrl,$downloadToExe)
		Write-Host "  - Download complete ($downloadToExe), installing..."

		Write-Host "  - Installing..."
		Start-Process $downloadToExe -ArgumentList "/features OptionId.WindowsDesktopDebuggers /quiet /norestart" -Wait -NoNewWindow

		Write-Host "  - Removing $downloadToExe..."
		Remove-Item $downloadToExe -Force
	}
	else
	{
		Write-Host "  - Allready installed."
	}
}

Add-WindowsDebuggers "8.100.26837" "http://octopus00.mvno.local:8080/sdksetup.exe"
