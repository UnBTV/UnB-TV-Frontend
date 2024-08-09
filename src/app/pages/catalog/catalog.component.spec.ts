import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogComponent } from './catalog.component';
import { VideoService } from 'src/app/services/video.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IVideo } from 'src/shared/model/video.model';
import { FormsModule } from '@angular/forms';


describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;
  let videoServiceMock: any;
  let authServiceMock: any;
  let userServiceMock: any;
  let routerMock: any;


  beforeEach(async () => {
    videoServiceMock = {
      findAll: jasmine.createSpy('findAll').and.returnValue(of({ body: { videoList: [] } })),
      videosCatalog: jasmine.createSpy('videosCatalog'),
      setVideosCatalog: jasmine.createSpy('setVideosCatalog'),
      getWatchLaterVideos: jasmine.createSpy('getWatchLaterVideos').and.returnValue(of({ videoList: [] }))
    };


    authServiceMock = {
      isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true)
    };


    userServiceMock = {
      getUser: jasmine.createSpy('getUser').and.returnValue(of({ id: 'user123' }))
    };


    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };


    await TestBed.configureTestingModule({
      declarations: [CatalogComponent],
      imports: [FormsModule],
      providers: [
        { provide: VideoService, useValue: videoServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call findAll and getUserDetails on init if authenticated', () => {
    spyOn(component, 'findAll').and.callThrough();
    spyOn(component, 'getUserDetails').and.callThrough();
    component.ngOnInit();
    expect(component.isAuthenticated).toBe(true);
    expect(component.getUserDetails).toHaveBeenCalled();
    expect(component.findAll).toHaveBeenCalled();
  });


  it('should populate videosEduplay and unbTvVideos on findAll success', () => {
    const videos: IVideo[] = [
      { id: 1, title: 'Video 1', channels: [{ id: 1, name: 'unbtv' }] },
      { id: 2, title: 'Video 2', channels: [{ id: 2, name: 'other' }] }
    ];


    videoServiceMock.findAll.and.returnValue(of({ body: { videoList: videos } }));


    component.findAll();


    expect(component.videosEduplay.length).toBe(2);
    expect(component.videosEduplay[0].id).toBe(1);
  });


  it('should log error on findAll error', () => {
    spyOn(console, 'log');
    videoServiceMock.findAll.and.returnValue(throwError('Error'));


    component.findAll();


    expect(console.log).toHaveBeenCalledWith('Error');
  });


  it('should filter videos based on filterTitle', () => {
    component.unbTvVideos = [
      { id: 1, title: 'Angular', description: '', keywords: '', catalog: '' },
      { id: 2, title: 'React', description: '', keywords: '', catalog: '' }
    ];


    component.filterTitle = 'Angular';
    component.filterVideos();


    expect(component.filteredVideos).toEqual([component.unbTvVideos[0]]);
  });


  it('should navigate to /videos on program click', () => {
    const videos: IVideo[] = [{ id: 1, title: 'Video 1', channels: [] }];
    component.onProgramClick(videos);
    expect(videoServiceMock.setVideosCatalog).toHaveBeenCalledWith(videos);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/videos']);
  });


  it('should populate watchLaterVideos on getWatchLaterVideos success', () => {
    const watchLaterVideos = [
      { id: 1, video_id: 1, title: 'Watch Later 1', channels: [{ id: 1, name: 'unbtv' }] },
      { id: 2, video_id: 2, title: 'Watch Later 2', channels: [{ id: 1, name: 'unbtv' }] }
    ];


    component.unbTvVideos = [
      { id: 1, title: 'Watch Later 1', channels: [{ id: 1, name: 'unbtv' }] },
      { id: 2, title: 'Watch Later 2', channels: [{ id: 1, name: 'unbtv' }] }
    ];


    videoServiceMock.getWatchLaterVideos.and.returnValue(of({ videoList: watchLaterVideos }));


    component.getWatchLaterVideos();


    expect(component.watchLaterVideos.length).toBe(2);
    expect(component.watchLaterVideos[0].id).toBe(1);
    expect(component.watchLaterVideos[1].id).toBe(2);
  });


  it('should log warning on getWatchLaterVideos with unexpected structure', () => {
    spyOn(console, 'warn');
    videoServiceMock.getWatchLaterVideos.and.returnValue(of({ incorrectKey: [] }));


    component.getWatchLaterVideos();


    expect(console.warn).toHaveBeenCalledWith('A estrutura da resposta da API não está conforme o esperado:', { incorrectKey: [] });
  });


  it('should filter videos to watch later when checkbox is checked', () => {
    const watchLaterVideos = [
      { id: 1, video_id: 1, title: 'Watch Later 1', channels: [{ id: 1, name: 'unbtv' }] }
    ];


    component.unbTvVideos = [
      { id: 1, title: 'Watch Later 1', channels: [{ id: 1, name: 'unbtv' }] },
      { id: 2, title: 'Not Watch Later', channels: [{ id: 1, name: 'unbtv' }] }
    ];


    videoServiceMock.getWatchLaterVideos.and.returnValue(of({ videoList: watchLaterVideos }));


    component.filterWatchLater = true;
    component.onFilterWatchLaterChange();


    expect(component.filteredVideos.length).toBe(1);
    expect(component.filteredVideos[0].title).toBe('Watch Later 1');
  });


  it('should not filter videos to watch later when checkbox is unchecked', () => {
    const watchLaterVideos = [
      { id: 1, video_id: 1, title: 'Watch Later 1', channels: [{ id: 1, name: 'unbtv' }] }
    ];


    component.unbTvVideos = [
      { id: 1, title: 'Watch Later 1', channels: [{ id: 1, name: 'unbtv' }] },
      { id: 2, title: 'Not Watch Later', channels: [{ id: 1, name: 'unbtv' }] }
    ];


    videoServiceMock.getWatchLaterVideos.and.returnValue(of({ videoList: watchLaterVideos }));


    component.filterWatchLater = false;
    component.onFilterWatchLaterChange();


    expect(component.filteredVideos.length).toBe(2);
  });
});