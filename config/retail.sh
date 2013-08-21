#!/bin/sh

### BEGIN INIT INFO
# Provides:          retail
# Required-Start:    $local_fs $remote_fs $network $syslog nginx dnsmasq 
# Required-Stop:     $local_fs $remote_fs $network $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts retail web server
# Description:       retail web server 
### END INIT INFO

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
PYTHON=/usr/bin/python
NAME=retail
DESC=retail

# Include nginx defaults if available
if sudo [ -f /var/run/hostapd/wlan0 ]; then
	sudo rm /var/run/hostapd/wlan0
fi

case "$1" in
	start)
		echo -n "Starting $DESC: "
		start-stop-daemon -b -m --start --pidfile /var/run/$NAME.hostapd.pid \
		    --exec /usr/sbin/hostapd -- "/etc/hostapd/hostapd.conf"
	 	sleep 5	
		ifconfig wlan0 10.0.0.1
		sleep 5	
		start-stop-daemon -b -m --pidfile /var/run/$NAME.server.pid \
		    --chdir "/home/pi/code/kiosk/src" --start --pidfile /var/run/$NAME.server.pid \
		    --exec /usr/bin/python -- "/home/pi/code/kiosk/src/server.py"
		;;

	stop)
		echo -n "Stopping $DESC: "
		start-stop-daemon --stop --quiet --pidfile /var/run/$NAME.hostapd.pid \
		    --exec /usr/sbin/hostapd -- "/etc/hostapd/hostapd.conf"
		start-stop-daemon --stop --quiet --pidfile /var/run/$NAME.server.pid \
		    --exec /usr/bin/python -- "/home/pi/code/kiosk/src/server.py" 
		echo "$NAME."
		;;

	restart|force-reload)
		echo -n "Restarting $DESC: "
		start-stop-daemon --stop --quiet --pidfile \
		    /var/run/$NAME.pid --exec $DAEMON || true
		sleep 1
		test_nginx_config
		# Check if the ULIMIT is set in /etc/default/nginx
		if [ -n "$ULIMIT" ]; then
			# Set the ulimits
			ulimit $ULIMIT
		fi
		start-stop-daemon --start --quiet --pidfile \
		    /var/run/$NAME.pid --exec $DAEMON -- $DAEMON_OPTS || true
		echo "$NAME."
		;;

	reload)
		echo -n "Reloading $DESC configuration: "
		test_nginx_config
		start-stop-daemon --stop --signal HUP --quiet --pidfile /var/run/$NAME.pid \
		    --exec $DAEMON || true
		echo "$NAME."
		;;

	configtest|testconfig)
		echo -n "Testing $DESC configuration: "
		
		;;

	status)
		status_of_proc -p /var/run/$NAME.pid "$DAEMON" nginx && exit 0 || exit $?
		;;
	*)
		echo "Usage: $NAME {start|stop}" >&2
		exit 1
		;;
esac

exit 0
