#!/usr/bin/env python
# -*- coding: UTF-8 -*-
#from appengine_twitter import AppEngineTwitter
from google.appengine.api import users
from google.appengine.ext import webapp
from  google.appengine.api import memcache
from  google.appengine.api import mail
from  google.appengine.ext import db
from  google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app
import os
""" base64 : Basic Auth """
import logging
from base64 import b64decode
""" / base64 : Basic Auth """
"""
    FB FaceBook First Generate 
"""

class MainPage(webapp.RequestHandler):
    
    def get(self):
        self.response.headers['Content-Type'] = 'text/html'
        o=open("./index.html").read()
        self.response.out.write(o)
        
    def post(self):
        """self.response.headers['Content-Type'] = 'text/html'"""
        (s,b,n)=(self.request.get("email"),self.request.get("body"),self.request.get("name"))
        to = 'R.Suga<sugar861977@livedoor.com>, Ryohei Suga<ryohei.suga@gmail.com>'
        #b += "\n- Google App Engine（ダジャレクラウド）より送信".encode("UTF-8")
        str = n+'\n'.encode("utf-8")+b
        if s!="" and b!="":
            mail.send_mail(
                sender = s,
                to = to,
                subject = "ダジャレクラウドにお問い合わせがありました。",
                body = str
                #body = str.encode("UTF-8")
            )
            self.response.out.write("お問い合わせありがとうございました。<br>送信が完了いたしました。<br>※ 開発スタッフかたの返信には時間がかかる事もございますのでしばらくお待ちください。")
            # self.redirect('http://dajare1242.appspot.com/')
            
class EditPage(webapp.RequestHandler):
    def get(self):
        auth=0
        if self.__basicAuth():
            auth=1
        else:
            code = 401
            self.error(code)
            self.response.out.write(self.response.http_status_message(code))
        # 認証後の処理
        if auth==1:
            self.response.headers['Content-Type'] = 'text/html'
            o = open('./index.html');
            str = o.read()
            path = os.path.join(os.path.dirname(__file__), 'tmpl/edit.tmpl')
            
        # self.response.out.write('編集画面')
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
            self.response.headers['Content-Type'] = 'text/html'
            c=self.request.get("type")
            num=5
           
            self.redirect("/canvas/edit")
            # print self.request.get("source")
            # self.response.out.write('編集画面')
            # self.response.out.write(user)
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

application = webapp.WSGIApplication([('/mail/edit*', EditPage),('/mail*', MainPage)], debug=True)


def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
