#!/usr/bin/env python
# -*- coding: UTF-8 -*-
#from appengine_twitter import AppEngineTwitter
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext import db
from  google.appengine.api import memcache
from  google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.api import urlfetch
import os

""" base64 : Basic Auth """
import logging
from base64 import b64decode
""" /base64 : Basic Auth """

"""
    DataStore API
"""
class ManualData(db.Model):
    source=db.TextProperty()

class MainPage(webapp.RequestHandler):
    def get(self):
        q=ManualData.all()
        rs=q.fetch(5)
        str=''
        if len(rs)==0:
            self.response.headers['Content-Type'] = 'text/html'
            o = urlfetch.fetch('http://www.ohfuji.name/dajare/apicall.html');
            str = o.content
        
        if len(rs)>0:
            str = rs[0].source
        self.response.out.write(str)
class EditPage(webapp.RequestHandler):
    def get(self):
        """
            認証
        """
        if self.__basicAuth():
            q=ManualData.all()
            rs=q.fetch(5)
            str=''
            if len(rs)==0:
                self.response.headers['Content-Type'] = 'text/html'
                o = urlfetch.fetch('http://www.ohfuji.name/dajare/apicall.html');
                str = o.content
            if len(rs)>0:
                str = rs[0].source
            
            path = os.path.join(os.path.dirname(__file__), 'tmpl/edit.tmpl')
            q = ManualData.all()
            rs=q.fetch(10)
            if len(rs)>0:
                str=rs[0].source        
            self.response.out.write(template.render(path, {"source":str}))
        else:
            code = 401
            self.error(code)
            self.response.out.write(self.response.http_status_message(code))
        """
            認証
        """
        
        
    def post(self):
        auth=0
        if self.__basicAuth():
            auth=1
        else:
            code = 401
            self.error(code)
            self.response.out.write(self.response.http_status_message(code))
        # 認証後の処理
        if auth==1:
            e=self.request.get("type");
            q=ManualData.all()
            rs=q.fetch(5)
            str=''
            if len(rs)>0 :
                for result in rs:
                    result.delete()
            
            if e=="edit" :
                s=self.request.get("source");
                i=ManualData(source=s)
                i.put()
            q=ManualData.all()
            rs=q.fetch(5)
            if len(rs)>0 :
                str = rs[0].source
            path = os.path.join(os.path.dirname(__file__), 'tmpl/edit.tmpl')
            q = ManualData.all()
            rs=q.fetch(10)
            if len(rs)>0:
                str=rs[0].source   
            self.response.out.write(template.render(path, {"source":str}))
        
    def __basicAuth(self):
        auth_header = self.request.headers.get('Authorization')
        if auth_header:
            try:
                (scheme, base64) = auth_header.split(' ')
                if scheme != 'Basic':
                    return False
                (username, password) = b64decode(base64).split(':')
                # 認証
                if username == 'dajare1242' and password == 'app10jolf':
                    return True
            except (ValueError, TypeError), err:
                logging.warn(type(err))
                return False

        self.response.set_status(401)
        self.response.headers['WWW-Authenticate'] = 'Basic realm="BasicAuthenticate"' 
  
application = webapp.WSGIApplication([('/manual*', MainPage),('/manual/edit*', EditPage)], debug=True)


def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
