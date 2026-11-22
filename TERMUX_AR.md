# دليل CLASSIC DEVELOPER على Termux وCloudflare

## أ) استبدال ملفات المشروع بالنسخة الكاملة

نزّل ملف `classic-developer.zip` من المحادثة إلى مجلد Downloads في الهاتف، ثم نفّذ:

```bash
pkg update -y
pkg install unzip git -y
mkdir -p ~/projects/classic-developer
cd ~/projects
unzip -o ~/storage/downloads/classic-developer.zip
cd ~/projects/classic-developer
```

إذا كان ملف ZIP في مكان آخر، عدّل مساره في أمر unzip.

## ب) رفع التحديث إلى GitHub

```bash
git status
git add .
git commit -m "Complete Cloudflare Pages and D1 integration"
git branch -M main
git remote set-url origin https://github.com/mortada17600-commits/classic-developer.git
git push -u origin main
```

إذا قال Git إن كل شيء مرفوع ولا توجد تغييرات، فهذا يعني أن الملفات المحلية لم تُستبدل بالنسخة الجديدة أو أن النسخة نفسها موجودة بالفعل. افحص `git status` و`git log -1`.

## ج) إعداد D1

1. Cloudflare Dashboard → Storage & Databases → D1 SQL Database.
2. أنشئ قاعدة باسم `classic-developer-db`.
3. افتح Console في قاعدة البيانات.
4. افتح ملف `schema.sql` في المشروع وانسخ محتواه كاملاً إلى Console ثم اضغط Execute.
5. افتح Workers & Pages → مشروع Pages → Settings → Functions → D1 database bindings.
6. أضف Binding باسم `DB` واختر `classic-developer-db` ثم Save.

## د) متغيرات Cloudflare

من Settings → Variables and Secrets أضف:

- `DISCORD_CLIENT_ID` — Application ID من Discord Developer Portal.
- `DISCORD_CLIENT_SECRET` — Secret من OAuth2.
- `DISCORD_REDIRECT_URI` — `https://YOUR-PROJECT.pages.dev/api/auth/callback`.
- `SESSION_SECRET` — قيمة عشوائية طويلة.
- `DISCORD_BOT_TOKEN` — Bot Token.
- `ADMIN_DISCORD_ID` — Discord User ID لحساب المدير.

ولإنشاء SESSION_SECRET من Termux:

```bash
pkg install openssl -y
openssl rand -hex 32
```

ضع Client Secret وBot Token وSESSION_SECRET كـ **Secrets** وليس Variables عامة. لا تضعها في ملفات المشروع ولا ترسلها في المحادثات.

## هـ) إعداد Discord Developer Portal

1. أنشئ Application باسم CLASSIC DEVELOPER.
2. من OAuth2 → Redirects أضف رابط `DISCORD_REDIRECT_URI` نفسه حرفياً.
3. انسخ Application ID وClient Secret.
4. من Bot أنشئ Bot وانسخ Token.
5. أضف البوت إلى سيرفر مشترك مع حساب المدير حتى يستطيع فتح DM معك.
6. فعّل Developer Mode في Discord وانسخ User ID لحساب المدير.

## و) إعادة النشر

بعد إضافة المتغيرات وربط D1، افتح Pages → Deployments وأعد نشر آخر Commit (Retry deployment) أو ادفع Commit جديداً إلى GitHub.

## ز) الروابط

- الموقع: `https://YOUR-PROJECT.pages.dev/`
- تسجيل الدخول: `/api/auth/login`
- لوحة المدير: `/admin.html` (تُحمى البيانات والعمليات من جهة الخادم)
- Callback: `/api/auth/callback`

## تنبيهات

- لا يمكن تشغيل تسجيل الدخول أو الطلبات قبل إعداد OAuth2 والمتغيرات وربط D1 وتشغيل `schema.sql`.
- رابط `pages.dev` مجاني. الدومين المخصص مثل `.com` يحتاج عادةً شراء/امتلاك الدومين؛ Cloudflare يوفر نطاق `pages.dev` مجاناً.
- لا تشارك Discord Bot Token أو Client Secret أو SESSION_SECRET مع أي شخص.
