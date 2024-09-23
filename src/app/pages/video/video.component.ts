import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VideoService } from '../../services/video.service';
import { IVideo } from 'src/shared/model/video.model';
import { Catalog } from 'src/shared/model/catalog.model';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
})
export class VideoComponent implements OnInit {
  unbTvChannelId = UNB_TV_CHANNEL_ID;
  unbTvVideos: IVideo[] = [];
  videosEduplay: IVideo[] = [];
  tagVideo!: string;
  catalog: Catalog = new Catalog();
  videosToShow: IVideo[] = [];

  constructor(
    private videoService: VideoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.tagVideo = this.route.snapshot.params['tagVideo'];
    this.findAll();
  }

  findAll(): void {
    this.videoService.findAll().subscribe({
      next: (data) => {
        this.videosEduplay = data.body?.videoList ?? [];
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.filterVideosByChannel(this.videosEduplay);
        this.videosCatalog(this.unbTvVideos);
      },
    });
  }

  videosCatalog(videos: IVideo[]): void {
    const keywordsCategories = [
      {
        tag: 'falaJovem',
        keywords: ['fala, jovem', 'fala jovem'],
        category: this.catalog.journalism.falaJovem,
      },
      {
        tag: 'informeUnB',
        keywords: ['informe unb'],
        category: this.catalog.journalism.informeUnB,
      },
      {
        tag: 'zapping',
        keywords: ['zapping'],
        category: this.catalog.journalism.zapping
      },
      {
        tag: 'brasilEmQuestao',
        keywords: ['brasil em questão'],
        category: this.catalog.interviews.brasilEmQuestao,
      },
      {
        tag: 'dialogos',
        keywords: ['diálogos'],
        category: this.catalog.interviews.dialogos
      },
      {
        tag: 'tirandoDeLetra',
        keywords: ['tirando de letra'],
        category: this.catalog.interviews.tirandoDeLetra,
      },
      {
        tag: 'entrevistas',
        keywords: ['entrevista'],
        category: this.catalog.interviews.entrevistas,
      },
      {
        tag: 'vastoMundo',
        keywords: ['vasto mundo'],
        category: this.catalog.interviews.vastoMundo,
      },
      {
        tag: 'vozesDiplomaticas',
        keywords: ['vozes diplomáticas'],
        category: this.catalog.interviews.vozesDiplomaticas,
      },
      {
        tag: 'expliqueSuaTese',
        keywords: ['explique sua tese'],
        category: this.catalog.researchAndScience.expliqueSuaTese,
      },
      {
        tag: 'fazendoCiencia',
        keywords: ['fazendo ciência'],
        category: this.catalog.researchAndScience.fazendoCiencia,
      },
      {
        tag: 'radarDaExtencao',
        keywords: ['radar da extensão'],
        category: this.catalog.researchAndScience.radarDaExtencao,
      },
      {
        tag: 'seLigaNoPAS',
        keywords: ['se liga no pas'],
        category: this.catalog.researchAndScience.seLigaNoPAS,
      },
      {
        tag: 'unbTvCiencia',
        keywords: ['unbtv ciência'],
        category: this.catalog.researchAndScience.unbTvCiencia,
      },
      {
        tag: 'universidadeParaQue',
        keywords: ['universidade pra quê?', 'universidade para quê?'],
        category: this.catalog.researchAndScience.universidadeParaQue,
      },
      {
        tag: 'emCantos',
        keywords: ['[em]cantos'],
        category: this.catalog.artAndCulture.emCantos,
      },
      {
        tag: 'casaDoSom',
        keywords: ['casa do som'],
        category: this.catalog.artAndCulture.casaDoSom,
      },
      {
        tag: 'esbocos',
        keywords: ['esboços'],
        category: this.catalog.artAndCulture.esbocos
      },
      {
        tag: 'exclusiva',
        keywords: ['exclusiva'],
        category: this.catalog.artAndCulture.exclusiva,
      },
      {
        tag: 'florestaDeGente',
        keywords: ['floresta de gente'],
        category: this.catalog.specialSeries.florestaDeGente,
      },
      {
        tag: 'guiaDoCalouro',
        keywords: ['guia do calouro'],
        category: this.catalog.specialSeries.guiaDoCalouro,
      },
      {
        tag: 'memoriasPauloFreire',
        keywords: ['memórias sobre paulo freire'],
        category: this.catalog.specialSeries.memoriasPauloFreire,
      },
      {
        tag: 'desafiosDasEleicoes',
        keywords: ['desafios das eleições'],
        category: this.catalog.specialSeries.desafiosDasEleicoes,
      },
      {
        tag: 'vidaDeEstudante',
        keywords: ['vida de estudante'],
        category: this.catalog.specialSeries.vidaDeEstudante,
      },
      {
        tag: 'arquiteturaICC',
        keywords: ['arquitetura'],
        category: this.catalog.specialSeries.arquiteturaICC,
      },
      {
        tag: 'miniDoc',
        keywords: [
          'mini doc',
          'cerrado de volta',
          'construção tradicional kalunga',
          'o muro',
          'um lugar para onde voltar',
          'vidas no cárcere',
        ],
        category: this.catalog.documentaries.miniDoc,
      },
      {
        tag: 'documentaries',
        keywords: [
          'documentários',
          'documentário',
          'quanto vale um terço?',
          'refazendo os caminhos de george gardner',
          'sem hora para chegar',
          'todas podem ser vitímas',
        ],
        category: this.catalog.documentaries.documentaries,
      },
      {
        tag: 'pitadasDoCerrado',
        keywords: ['pitadas do cerrado'],
        category: this.catalog.varieties.pitadasDoCerrado,
      },
    ];

    videos.forEach((video) => {
      const keywordsTitle = video?.keywords?.toLowerCase() ?? '';

      if (keywordsTitle) {
        const category = keywordsCategories.find((config) =>
          config.keywords.some((keyword) => keywordsTitle.includes(keyword))
        );

        if (category) {
          category.category.push(video);
        } else {
          this.catalog.unbtv.push(video);
        }
      }
    });
    const videosCategory = keywordsCategories.find((config) => config.tag === this.tagVideo);
    if (videosCategory) this.videosToShow = videosCategory.category;
    else this.videosToShow = [];
    console.log(videosCategory);
  }

  filterVideosByChannel(videos: IVideo[]): void {
    videos.forEach((video) => {
      const channel = video?.channels;

      if (channel)
        if (channel[0].id === this.unbTvChannelId) this.unbTvVideos.push(video);
    });
  }

  getVideos(): void {
    this.videoService.getVideosCatalog().subscribe({
      next: (videos) => {
        this.unbTvVideos = videos;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  returnToCatalog(): void {
    this.router.navigate(['/catalog']);
  }
}
