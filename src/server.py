'''
Created on Jun 28, 2013

@author: amit
'''

import tornado
from tornado import web,httpserver
from tornado.escape import json_encode
import os, datetime

KIOSK_ID = 'aisle45'

class KioskHandler(web.RequestHandler):
    def get(self):
        return self.write(json_encode(KIOSK_ID))

class CouponHandler(web.RequestHandler):
    coupon_path = os.path.join(os.path.dirname(__file__),'static/coupon')
    def get(self):
        coupons = [f for f in os.listdir(CouponHandler.coupon_path) \
                 if os.path.isfile(os.path.join(CouponHandler.coupon_path,f))]        
        result = [dict({'barcode': abs(hash(c)) ,'image':c }) for c in coupons]                
        self.write(json_encode(result));

class MainHandler(web.RequestHandler):
    def get(self):
        self.render('index.html')
   
class ManifestHandler(web.RequestHandler):
    time=datetime.datetime.now()
    
    def initialize(self):
        pass
 
    def get(self):
        self.set_header("Content-Type", "text/cache-manifest") 
        self.render("manifest", time=ManifestHandler.time)        
        
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
        (r"/coupon", CouponHandler),
        (r"/*",MainHandler ),
        (r'/cache.manifest', ManifestHandler),
	    (r"/(apple-touch-icon\.png)", tornado.web.StaticFileHandler,
    dict(path=settings['static_path'])),], **settings))
    sockets = tornado.netutil.bind_sockets(9999)    
    http_server.add_sockets(sockets)
    tornado.ioloop.IOLoop.instance().start()
        

if __name__ == "__main__":
    main()
