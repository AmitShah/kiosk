'''
Created on Jun 28, 2013

@author: amit
'''

import tornado
from tornado import web,websocket,httpserver

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
  
#shared memory object
 
observer = Observable()

#=====================
         
def main():
    settings = {
      "static_path": '/Users/andrew/git/kiosk/src/',
      "cookie_secret": "digital_display_cookie"
    }

    print(settings)

    http_server = tornado.httpserver.HTTPServer(tornado.web.Application([
        (r"/activate", ActivateOfferHandler),
        (r"/", MainHandler),
        
        (r"/(apple-touch-icon\.png)", tornado.web.StaticFileHandler,
     dict(path=settings['static_path'])),], **settings))
    sockets = tornado.netutil.bind_sockets(8080)
    #tornado.process.fork_processes(0)
    
    http_server.add_sockets(sockets)
    tornado.ioloop.IOLoop.instance().start()
    #create daemon scheduler thread
    

if __name__ == "__main__":
    main()
