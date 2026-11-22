# تشغيل CLASSIC DEVELOPER من Termux — دليل سريع

## 1) فك ضغط المشروع

نزّل ملف ZIP إلى هاتفك، ثم نفّذ (عدّل المسار إذا كان الملف بمكان آخر):

```bash
termux-setup-storage
pkg update -y
pkg install unzip git -y
mkdir -p ~/projects
unzip ~/storage/downloads/classic-developer.zip -d ~/projects/
cd ~/projects/classic-developer
```

## 2) رفعه إلى GitHub

أنشئ مستودعاً فارغاً على GitHub باسم `classic-developer`، ثم:

```bash
git init
git add .
git commit -m "Initial CLASSIC DEVELOPER website"
git branch -M main
git remote add origin https://github.com/USERNAME/classic-developer.git
git push -u origin main
```

استبدل `USERNAME` باسم حساب GitHub. إذا طلب GitHub كلمة مرور، استخدم تسجيل الدخول عبر المتصفح أو Personal Access Token؛ لا تضع التوكن داخل ملفات المشروع.

## 3) ربطه بكلاودفلير

- Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
- اختر مستودع `classic-developer`.
- Framework preset: None.
- Build command: فارغ.
- Build output directory: `.`.
- Deploy.

سيظهر رابط مجاني ينتهي بـ `pages.dev`.

## 4) إعداد Discord وCloudflare

راجع `README.md` لإعداد Discord OAuth2 وD1 والمتغيرات السرية. أهم شيء: لا ترفع `DISCORD_BOT_TOKEN` أو `DISCORD_CLIENT_SECRET` إلى GitHub.
