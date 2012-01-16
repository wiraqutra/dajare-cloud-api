import os 
from google.appengine.api import urlfetch

req = os.getenv("");


url = "http://dajare.ohfuji.name" + os.getenv("PATH_INFO") 
if os.getenv("QUERY_STRING") != '':
  url = url + "?" + os.getenv("QUERY_STRING")
result = urlfetch.fetch(url) 

if result.status_code == 200:   
  print 'Content-Type: application/json; charset=utf-8'
  print ''
  print result.content
else:
  print 'Context-Type: text/plain'
  print ''
  print 'Syntax Error!'
