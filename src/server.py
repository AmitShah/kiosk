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
 
import base64, hashlib,json

class CouponCache(object):
    coupons = {}
    encoded = ''
    def  __init__(self, str_dir):    
        self.dir = os.path.abspath(str_dir)
        self.get_config()
	self.update()
        
    def get_encoded(self):
        return self.encoded
    
    def update(self):
        files = [os.path.join(self.dir,f) for f in os.listdir(self.dir) if os.path.isfile(os.path.join(self.dir,f))]
        for f in files:
            with open(f, "rb") as image_file:
                description = self.config[os.path.basename(f)]
		self.coupons[int(hashlib.md5(f).hexdigest(), 16)] = {"data":(base64.b64encode(image_file.read())),"description": description }
             
        self.encoded = json_encode(self.coupons)

    def get_config(self):
	with open(os.path.join(self.dir,'config/config.json')) as config:
	    data = config.read()
	    config.close()
	    print data
	    self.config = json.loads(data)
	    
class KioskHandler(web.RequestHandler):
    def get(self):
    	self.write(json_encode('kiosk1'))
  
class CouponHandler(web.RequestHandler): 
    def get(self):
        self.write(coupons.get_encoded())
    def post(self,coupon_id):
        self.write(json_encode('ok'))


class RedirectHandler(web.RequestHandler): 
    def get(self):
        self.redirect('http://coupons.ca')
    
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
        (r"/",MainHandler ),
	(r"/kiosk", KioskHandler),      
        (r"/coupon", CouponHandler),
        (r".*",RedirectHandler ),
	(r"/(apple-touch-icon\.png)", tornado.web.StaticFileHandler,
     dict(path=settings['static_path'])),], **settings))
    sockets = tornado.netutil.bind_sockets(8080)
    #tornado.process.fork_processes(0)
    
    http_server.add_sockets(sockets)
    tornado.ioloop.IOLoop.instance().start()
    #create daemon scheduler thread

        

if __name__ == "__main__":
    main()
