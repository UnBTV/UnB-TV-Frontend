import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VideoService } from 'src/app/services/video.service';
import { Catalog } from 'src/shared/model/catalog.model';
import { IVideo } from 'src/shared/model/video.model';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent {
  videosEduplay: IVideo[] = [];
  unbTvVideos: IVideo[] = [];
  catalog: Catalog = new Catalog();

  constructor(private videoService: VideoService, private router: Router) { }

  ngOnInit(): void {
  }


  onProgramClick(videosTag: string) {
    this.router.navigate(['/videos/', videosTag]);
  }
}
