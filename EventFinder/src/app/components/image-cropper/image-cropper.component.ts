import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit {

    @ViewChild('image', { static: false })
    public imageElement: ElementRef;

    @Input()
    public imageSource: string;

    public imageDestination: string;
    private cropper: Cropper;

  constructor() { }

  public ngAfterViewInit() {
    this.cropper = new Cropper(this.imageElement.nativeElement, {
        zoomable: true,
        background: false,
        scalable: false,
        aspectRatio: 1,
        movable: false,
        cropBoxResizable: false,
        minCropBoxHeight: 128,
        minCropBoxWidth: 128,
        minCanvasHeight: 128,
        minCanvasWidth: 128,
        viewMode: 1,
        guides: false,
        dragMode: 'move',
        center: false,

        crop: () => {
            const canvas = this.cropper.getCroppedCanvas();
            this.imageDestination = canvas.toDataURL("image/png");
        }
    });

    this.cropper.setData({
      width: 128,
      height: 128
    });
}

  ngOnInit() {
  }

}
