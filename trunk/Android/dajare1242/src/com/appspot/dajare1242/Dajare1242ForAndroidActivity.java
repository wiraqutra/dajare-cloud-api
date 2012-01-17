package com.appspot.dajare1242;
import java.util.ArrayList;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.content.Context;
import android.widget.Toast;

import android.speech.RecognizerIntent;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.LinearLayout;


public class Dajare1242ForAndroidActivity extends Activity {
	/** Called when the activity is first created. */
	private static final int REQUEST = 0;
	public String str="あいうえお";
	public WebView webview = null;
	public String url="https://dajare1242.appspot.com";
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebView webview = new WebView(this);  
        setContentView(webview);
        setContentView(R.layout.main);
        webview = (WebView) findViewById(R.id.webview);
        webview.loadUrl(url);
        webview.setWebViewClient(new WebViewClient() {
        	public void onProgressChanged(WebView view, int progress) {  
        		// activity.setProgress(progress * 1000);
        	}
        });
        // JS Enable
        webview.getSettings().setJavaScriptEnabled(true);
        // Hook JS
        DroidJS js = new DroidJS(this);
        webview.addJavascriptInterface(js, "DroidJS");       
    }
    @Override
    protected void onActivityResult( int requestCode, int resultCode, Intent data) {
        // 自分が投げたインテントであれば応答する
        if (requestCode == REQUEST && resultCode == RESULT_OK) {
            String speakedString = "";
            webview = (WebView) findViewById(R.id.webview);
            // 結果文字列リスト
            // 複数の文字を認識した場合，結合して出力
            ArrayList<String> speechToChar = data.getStringArrayListExtra(
            		RecognizerIntent.EXTRA_RESULTS);
            
            for (int i = 0; i< speechToChar.size(); i++) {
            	if(i == 1){
            		speakedString += speechToChar.get(i);
            	}
            }
            // Java -> JavaScriptへ
            webview.loadUrl("javascript:callbackForAndroid('"+speakedString+"');");
        }
        super.onActivityResult(requestCode, resultCode, data);
    }
    private class DroidJS {
    	private Context con;
    	public DroidJS(Context con){
    		this.con = con;
    	}
    	public final String appearToast(String message){
    		try {
                // インテント作成
                // 入力した音声を解析する。
                Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH); 
                // free-form speech recognition.
                intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                            RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                // 表示させる文字列
                intent.putExtra(RecognizerIntent.EXTRA_PROMPT,"音声を文字で出力します");
                // インテント開始
                startActivityForResult(intent, REQUEST);
                
            } catch (ActivityNotFoundException e) {
                // アクティビティが見つからなかった
                Toast.makeText(
                		Dajare1242ForAndroidActivity.this,
                		"アクティビティが見つかりませんでした。", 
                		Toast.LENGTH_LONG
                ).show();
                
            }
    		return Dajare1242ForAndroidActivity.this.str;
    	}
    }
    
}
