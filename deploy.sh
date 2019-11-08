#! /bin/sh

# define hosts to deploy to

case $1 in
	-dev)
		hosts=("app-host-1_dev.wwtatc.local")
		;;
	-test)
		hosts=("app-host-1_test.wwtatc.local")
		;;
	-prod)
		hosts=("app-host-1_prod.wwtatc.local")
		;;
	*)
		echo "please run with $0 -dev or $0 -test or $0 -prod"
		exit 1
esac

for i in ${hosts[@]}; do
	gulp
	gulpStatus=$?
	if [ $gulpStatus -eq 1 ]; then
		echo "Build failed please review the log"
		exit 1
	fi
	scp -r release/* root@${i}:/var/atc/ts-api/
	scp endpoints.json root@${i}:/var/atc/ts-api/
	scp gitInfo.json root@${i}:/var/atc/ts-api/
	scp package.json root@${i}:/var/atc/ts-api/
	ssh root@${i} "cd /var/atc/ts-api; /root/.nvm/versions/node/v6.2.2/bin/npm prune; /root/.nvm/versions/node/v6.2.2/bin/npm install"
	scp monit.d/* root@${i}:/etc/monit.d/
	ssh root@${i} "service ts-api stop"
	scp init.d/* root@${i}:/etc/init.d/
	ssh root@${i} "/sbin/chkconfig ts-api on"
	ssh root@${i} "rm -f /var/atc/ts-api/pid/app.pid"
	ssh root@${i} "service ts-api start"
	ssh root@${i} "service monit reload"
done
