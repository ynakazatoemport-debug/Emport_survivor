Add-Type -AssemblyName System.Drawing
$srcPath = "c:\Users\伊万里利用者用12\Desktop\ヴァンパイアサバイバーのようなゲーム\キャラ\自機\立ち絵\農業_キャラ.png"
$img = [System.Drawing.Image]::FromFile($srcPath)
$bmp = new-object System.Drawing.Bitmap $img

[int]$w = [Math]::Floor($img.Width / 4)
[int]$h = [Math]::Floor($img.Height / 2)

# Male is bottom row
[int]$y = $h

# Front
$rect = New-Object System.Drawing.Rectangle(0, $y, $w, $h)
$bmp.Clone($rect, $bmp.PixelFormat).Save("c:\Users\伊万里利用者用12\Desktop\ヴァンパイアサバイバーのようなゲーム\キャラ\自機\立ち絵\農業_男性＿前.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Back
$rect = New-Object System.Drawing.Rectangle($w, $y, $w, $h)
$bmp.Clone($rect, $bmp.PixelFormat).Save("c:\Users\伊万里利用者用12\Desktop\ヴァンパイアサバイバーのようなゲーム\キャラ\自機\立ち絵\農業_男性＿後ろ.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Left
$rect = New-Object System.Drawing.Rectangle(($w*2), $y, $w, $h)
$bmp.Clone($rect, $bmp.PixelFormat).Save("c:\Users\伊万里利用者用12\Desktop\ヴァンパイアサバイバーのようなゲーム\キャラ\自機\立ち絵\農業_男性＿左.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Right
$rect = New-Object System.Drawing.Rectangle(($w*3), $y, $w, $h)
$bmp.Clone($rect, $bmp.PixelFormat).Save("c:\Users\伊万里利用者用12\Desktop\ヴァンパイアサバイバーのようなゲーム\キャラ\自機\立ち絵\農業_男性＿右.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Female is top row
$y = 0

# Front
$rect = New-Object System.Drawing.Rectangle(0, $y, $w, $h)
$bmp.Clone($rect, $bmp.PixelFormat).Save("c:\Users\伊万里利用者用12\Desktop\ヴァンパイアサバイバーのようなゲーム\キャラ\自機\立ち絵\農業_女性＿前.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Back
$rect = New-Object System.Drawing.Rectangle($w, $y, $w, $h)
$bmp.Clone($rect, $bmp.PixelFormat).Save("c:\Users\伊万里利用者用12\Desktop\ヴァンパイアサバイバーのようなゲーム\キャラ\自機\立ち絵\農業_女性＿後ろ.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Left
$rect = New-Object System.Drawing.Rectangle(($w*2), $y, $w, $h)
$bmp.Clone($rect, $bmp.PixelFormat).Save("c:\Users\伊万里利用者用12\Desktop\ヴァンパイアサバイバーのようなゲーム\キャラ\自機\立ち絵\農業_女性＿左.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Right
$rect = New-Object System.Drawing.Rectangle(($w*3), $y, $w, $h)
$bmp.Clone($rect, $bmp.PixelFormat).Save("c:\Users\伊万里利用者用12\Desktop\ヴァンパイアサバイバーのようなゲーム\キャラ\自機\立ち絵\農業_女性＿右.png", [System.Drawing.Imaging.ImageFormat]::Png)

$img.Dispose()
