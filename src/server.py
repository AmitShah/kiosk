'''
Created on Jun 28, 2013

@author: amit
'''

import tornado
from tornado import web,httpserver
from tornado.escape import json_encode
import os

KIOSK_ID = 'aisle45'

class KioskHandler(web.RequestHandler):
    def get(self):
        return self.write(json_encode(KIOSK_ID))

class CouponHandler(web.RequestHandler):
    coupon_path = os.path.join(os.path.dirname(__file__),'web/coupon')
    def get(self):
        coupons = [f for f in os.listdir(MainHandler.coupon_path) \
                 if os.path.isfile(os.path.join(MainHandler.coupon_path,f))]
        self.write(json_encode(coupons));

class MainHandler(web.RequestHandler):
    def get(self):
        self.render('index.html')
    
        
def main():
    settings = dict(
        template_path=os.path.join(os.path.dirname(__file__), "template"),
        static_path=os.path.join(os.path.dirname(__file__), "static"),
        cookie_secret= 'secret_key',
        login_url='/login'
        ) 

    print(settings)

    http_server = tornado.httpserver.HTTPServer(tornado.web.Application([
        (r"/kiosk", KioskHandler),
        (r"/coupons", CouponHandler),
        (r"/*",MainHandler ),
	    (r"/(apple-touch-icon\.png)", tornado.web.StaticFileHandler,
    dict(path=settings['static_path'])),], **settings))
    sockets = tornado.netutil.bind_sockets(8080)    
    http_server.add_sockets(sockets)
    tornado.ioloop.IOLoop.instance().start()
        

if __name__ == "__main__":
    main()
