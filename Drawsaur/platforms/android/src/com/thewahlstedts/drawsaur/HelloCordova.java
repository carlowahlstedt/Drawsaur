/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.thewahlstedts.drawsaur;

import android.annotation.SuppressLint;
import android.os.Build;
import android.os.Bundle;
//import android.view.Menu;

import android.view.View;
import org.apache.cordova.*;
import com.google.analytics.tracking.android.EasyTracker;

public class HelloCordova extends CordovaActivity 
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init();
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
    }

    @Override
    public void onStart() {
      super.onStart();
      
      EasyTracker.getInstance().activityStart(this); // Add this method.
    }

    @Override
    public void onStop() {
      super.onStop();
      
      EasyTracker.getInstance().activityStop(this); // Add this method.
    }
    
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
    	super.onWindowFocusChanged(hasFocus);
    	if (hasFocus && Build.VERSION.SDK_INT >= 18) {
    		SetFullScreen();
        }
    }
    
    @SuppressLint({ "NewApi", "InlinedApi" })
	void SetFullScreen(){
        getActivity().getWindow().getDecorView().setSystemUiVisibility(
            	View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            	| View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            	| View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            	| View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            	| View.SYSTEM_UI_FLAG_FULLSCREEN
            	| View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }
}

