echo "Deploying Frontend..."
# Add deployment commands here
cd /home/simple-conf
git pull origin master
cd /home/simple-conf/apps/web
pnpm install
npm run build
systemctl restart simple
echo "Frontend Deployed Successfully."
systemctl status simple --no-pager

echo "Deploying Backend..."
# Add deployment commands here
cd /home/simple-conf/apps/api
git pull origin master
pnpm install
npm run dev
systemctl restart simplebackend
echo "Backend Deployed Successfully."
systemctl status simplebackend --no-pager

exit 0
