'''
Created on Jun 28, 2013

@author: amit
'''

import tornado
from tornado import web,websocket,httpserver
from tornado.escape import json_encode,json_decode

import os,Queue,datetime

class Observable(object):
    
    callbacks = {}
    def subscribe(self,key,callback):
        self.callbacks[key]=callback
    
    def __call__(self,value):
        for func in self.callbacks.values():
            func(value)
            
    def unsubscribe(self,key):
        del self.callbacks[key]
        
     

class MainHandler(web.RequestHandler):
    def get(self):
        self.render('web/index.html')
        
class ActivateOfferHandler(websocket.WebSocketHandler):
    
    def open(self):
        self.value = datetime.datetime.now()
        observer.subscribe(self.value , self.write_message)
        print 'open connection'
    
    def on_message(self,message):
        observer(str(datetime.datetime.now()))
   
    def on_close(self):
        observer.unsubscribe(self.value)
        print 'close connection'
 
import base64, hashlib

class CouponCache(object):
    coupons = {}
    encoded = ''
    def  __init__(self, str_dir):    
        self.dir = os.path.abspath(str_dir)
        self.update()
        
    def get_encoded(self):
        return self.encoded
    
    def update(self):
        files = [os.path.join(self.dir,f) for f in os.listdir(self.dir) if os.path.isfile(os.path.join(self.dir,f))]
        for f in files:
            with open(f, "rb") as image_file:
                self.coupons[int(hashlib.md5(f).hexdigest(), 16)] = (base64.b64encode(image_file.read()))
             
        self.encoded = json_encode(self.coupons)
        
class CouponHandler(web.RequestHandler): 
    def get(self):
        self.write(coupons.get_encoded())
    def post(self,coupon_id):
        self.write(json_encode('ok'))

#shared memory object
 
observer = Observable()
coupons = CouponCache('coupon')
#=====================
         
def main():
    settings = {
      "static_path": os.path.join(os.path.dirname(__file__),'web'),
      "cookie_secret": "digital_display_cookie"
    }

    print(settings)

    http_server = tornado.httpserver.HTTPServer(tornado.web.Application([
        (r"/activate", ActivateOfferHandler),
        (r"/", MainHandler),
        (r"/coupon", CouponHandler),
        (r"/(apple-touch-icon\.png)", tornado.web.StaticFileHandler,
     dict(path=settings['static_path'])),], **settings))
    sockets = tornado.netutil.bind_sockets(8080)
    #tornado.process.fork_processes(0)
    
    http_server.add_sockets(sockets)
    tornado.ioloop.IOLoop.instance().start()
    #create daemon scheduler thread

        

if __name__ == "__main__":
    main()
