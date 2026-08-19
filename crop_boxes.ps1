Add-Type -AssemblyName System.Drawing
$srcPath = "c:\Users\伊万里利用者用12\Desktop\ヴァンパイアサバイバーのようなゲーム\背景\木箱.png"
$img = [System.Drawing.Image]::FromFile($srcPath)
$bmp = new-object System.Drawing.Bitmap $img

$w = 250
$h = 250
$count = 0

for ($y = 0; $y -lt $img.Height; $y += $h) {
    for ($x = 0; $x -lt $img.Width; $x += $w) {
        $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
        $cropped = $bmp.Clone($rect, $bmp.PixelFormat)
        
        # Save to artifacts for inspection
        $cropped.Save("c:\Users\伊万里利用者用12\Desktop\ヴァンパイアサバイバーのようなゲーム\背景\木箱_$count.png", [System.Drawing.Imaging.ImageFormat]::Png)
        $count++
    }
}
$img.Dispose()
