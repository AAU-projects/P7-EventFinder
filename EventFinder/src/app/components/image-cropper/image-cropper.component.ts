import { Component, OnInit, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import Cropper from 'cropperjs';
import { SharedService } from 'src/app/services/shared.service';

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

    @Output() imageDestination: EventEmitter<string> = new EventEmitter();

    private cropper: Cropper;

  constructor(public shared: SharedService) {
  }

  cancel() {
    this.imageDestination.emit(null);
    this.shared.showCropper(false);
  }

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
            this.imageDestination.emit(canvas.toDataURL('image/png'));
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
