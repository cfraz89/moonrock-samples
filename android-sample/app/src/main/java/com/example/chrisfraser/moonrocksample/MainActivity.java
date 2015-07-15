package com.example.chrisfraser.moonrocksample;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.example.chrisfraser.moonrocksample.models.PostList;
import com.trogdor.moonrock.MoonRock;
import com.trogdor.moonrock.MoonRockModule;
import com.trogdor.moonrock.annotations.Portal;
import com.trogdor.moonrock.annotations.ReversePortal;

import butterknife.Bind;
import butterknife.ButterKnife;
import rx.Observable;
import rx.android.app.AppObservable;
import rx.android.view.ViewObservable;
import rx.android.widget.WidgetObservable;
import rx.subscriptions.CompositeSubscription;


public class MainActivity extends AppCompatActivity {
    MoonRock mMoonRock;
    Observable<MoonRockModule> mModuleReady;
    MoonRockModule moonRockModule;
    CompositeSubscription subscriptions;

    @Portal Observable<Object> addPressed;
    @Portal Observable<String> add1Text;
    @Portal Observable<String> add2Text;
    @ReversePortal Observable<String> sum;
    @ReversePortal Observable<PostList> posts;

    @Bind(R.id.addButton) Button addButton;
    @Bind(R.id.returnText) TextView sumView;
    @Bind(R.id.recycler) RecyclerView postsRecycler;
    @Bind(R.id.progressBar) ProgressBar spinner;
    @Bind(R.id.add1) EditText editAdd1;
    @Bind(R.id.add2) EditText editAdd2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);
        postsRecycler.setLayoutManager(new LinearLayoutManager(this));

        createObservables();

        mMoonRock = ((SampleApplication)getApplication()).getMoonRock();
        mModuleReady = mMoonRock.loadModule("app/appmodule", "sample", this);
        mModuleReady.subscribe(module -> {
            moonRockModule = module;
            module.generatePortals();
            module.restoreInstanceState(savedInstanceState);
        });
    }

    private void createObservables() {
        addPressed = ViewObservable.clicks(addButton).map(ev -> null);
        add1Text = WidgetObservable.text(editAdd1).map(ev -> ev.text().toString());
        add2Text = WidgetObservable.text(editAdd2).map(ev -> ev.text().toString());
    }

    void setupBehaviour(MoonRockModule module) {
        subscriptions = new CompositeSubscription();
        subscriptions.add(
            AppObservable.bindActivity(this, this.sum).subscribe(sum -> sumView.setText(sum != null ? sum : ""))
        );
        subscriptions.add(
            AppObservable.bindActivity(this, this.posts).subscribe(data -> {
                if (data != null) {
                    spinner.setVisibility(View.GONE);
                    postsRecycler.setVisibility(View.VISIBLE);
                    postsRecycler.setAdapter(new PostsAdapter(data));
                }
            })
        );
    }

    @Override
    protected void onStart() {
        super.onStart();
        mModuleReady.subscribe(this::setupBehaviour);
    }

    @Override
    protected void onStop() {
        super.onStop();
        subscriptions.unsubscribe();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (moonRockModule!=null)
            moonRockModule.saveInstanceState(outState);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (moonRockModule != null)
            moonRockModule.unlinkPortals();
        moonRockModule = null;
        mMoonRock = null;
    }
}
