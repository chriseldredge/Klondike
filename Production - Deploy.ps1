$prefix = "production"

$settingsFile = "settings.config"
$basepath = "D:\Mvno.Klondike.Nuget.Server\"

$packagepath = $basepath + $prefix + "-packages"
$symbolspath = $basepath + $prefix + "-symbols"
$lucenepath = $basepath + $prefix + "-lucene"

(GC $settingsFile).Replace('{packagepath}', $packagepath).Replace('{symbolspath}', $symbolspath).Replace('{lucenepath}', $lucenepath) | sc $settingsFile
