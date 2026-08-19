Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap('c:\Users\伊万里利用者用12\Desktop\ヴァンパイアサバイバーのようなゲーム\キャラ\デバフ\毒＿アイコン.png')
$opaqueCount = 0
$transCount = 0
for ($y = 0; $y -lt $bmp.Height; $y += 5) {
    for ($x = 0; $x -lt $bmp.Width; $x += 5) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.A -gt 200) { $opaqueCount++ }
        elseif ($c.A -eq 0) { $transCount++ }
    }
}
Write-Output "Opaque samples: $opaqueCount, Transparent samples: $transCount"
$bmp.Dispose()


