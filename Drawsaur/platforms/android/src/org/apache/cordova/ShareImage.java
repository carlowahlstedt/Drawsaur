/**
 * 
 * Phonegap share plugin for Android
 * Kevin Schaul 2011
 *
 */

package org.apache.cordova;

import java.io.File;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.net.Uri;

public class ShareImage extends CordovaPlugin {

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
		try {
			JSONObject jo = args.getJSONObject(1);

			if (args.getString(0).equals("text"))
			{
				doSendIntent(jo.getString("subject"), jo.getString("text")); 
			}
			else if (args.getString(0).equals("image"))
			{
				doSendIntent(jo.getString("fileName"));
			}
			else
			{
            	callbackContext.success("");
				return false;
			}
        	callbackContext.success("Sharing complete");
			return true;
		} catch (JSONException e) {
			e.printStackTrace();
            callbackContext.error(e.getMessage());
			return false;
		}
	}

	private void doSendIntent(String subject, String text) {
		Intent sendIntent = new Intent(android.content.Intent.ACTION_SEND);
		sendIntent.setType("text/plain");

		sendIntent.putExtra(android.content.Intent.EXTRA_SUBJECT, subject);
		sendIntent.putExtra(android.content.Intent.EXTRA_TEXT, text);
		this.cordova.startActivityForResult(this, sendIntent, 0);
	}
	
	private void doSendIntent(String fileName) {
		Intent sendIntent = new Intent(android.content.Intent.ACTION_SEND);
		sendIntent.setType("image/png");

		sendIntent.putExtra(android.content.Intent.EXTRA_SUBJECT, "Drawsaur");
		sendIntent.putExtra(android.content.Intent.EXTRA_TEXT, "Check out my drawing I made with Drawsaur!");
		Uri uriFile = Uri.fromFile(new File(fileName));
		sendIntent.putExtra(android.content.Intent.EXTRA_STREAM, uriFile);
		sendIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
		sendIntent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
		
		this.cordova.startActivityForResult(this, Intent.createChooser(sendIntent, "Share Drawsaur Image Using"), 0);
	}
}