function GetApiKey
{
    $computername = $env:computername.ToLower()
    if($computername.StartsWith("t"))
    {
        return "01b8cf93-de5b-4491-8b1c-500d1085d9e4"
    }
    return "4e8590cc-eacb-4153-80a0-7d7cf8c77bef"
}
$settingsFile = "settings.config"
$webconfigFile = "web.config"
$basepath = "D:\Mvno.Klondike.Nuget.Staging.Server\"
$logfilename = "Klondike.Staging.Log"

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
