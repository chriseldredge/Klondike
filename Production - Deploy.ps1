function GetApiKey
{
    $computername = $env:computername.ToLower()
    if($computername.StartsWith("t"))
    {
        return "7c3c4d2a-2967-43f6-9f24-35a2b155a107"
    }
    return "5540ded4-9e74-4acf-89fa-71a026841cf8"
}
$settingsFile = "settings.config"
$webconfigFile = "web.config"
$basepath = "D:\Mvno.Klondike.Nuget.Production.Server\"
$logfilename = "Klondike.Production.Log"

$packagepath = $basepath + "Packages"
$symbolspath = $basepath + "Symbols"
$lucenepath = $basepath + "Lucene"
$apiKey = GetApiKey

New-Item $basepath -ItemType Directory -Force -ErrorAction Ignore
New-Item $packagepath -ItemType Directory -Force -ErrorAction Ignore
New-Item $symbolspath -ItemType Directory -Force -ErrorAction Ignore
New-Item $lucenepath -ItemType Directory -Force -ErrorAction Ignore

(GC $settingsFile).Replace('{packagepath}', $packagepath).Replace('{symbolspath}', $symbolspath).Replace('{lucenepath}', $lucenepath).Replace('{localAdministratorApiKey}', $apiKey) | sc $settingsFile

(GC $webconfigFile).Replace('{logfilename}', $logfilename) | sc $webconfigFile
