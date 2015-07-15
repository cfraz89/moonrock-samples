package com.example.chrisfraser.moonrocksample;

import android.app.Application;

import com.trogdor.moonrock.MoonRock;

/**
 * Created by chrisfraser on 15/07/15.
 */
public class SampleApplication extends Application {
    MoonRock mMoonRock;

    @Override
    public void onCreate() {
        super.onCreate();
        mMoonRock = new MoonRock(this);
    }

    public MoonRock getMoonRock() {
        return mMoonRock;
    }
}
