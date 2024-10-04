import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input, OnChanges, SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {
  AccessibilityHelp,
  Alignment,
  Autoformat,
  AutoImage,
  Autosave, Base64UploadAdapter,
  BlockQuote,
  Bold,
  ClassicEditor,
  CodeBlock,
  EditorConfig,
  Essentials, Font,
  Heading,
  Highlight, HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Mention,
  Paragraph,
  PasteFromOffice,
  SelectAll,
  SimpleUploadAdapter,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize, TableProperties, TableToolbar, TextTransformation, TodoList, Underline, Undo
} from "ckeditor5";
import translations from 'ckeditor5/translations/es.js';
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {NgIf} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-ckeditor',
  standalone: true,
  imports: [
    CKEditorModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './ckeditor.component.html',
  styleUrl: './ckeditor.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CkeditorComponent implements AfterViewInit, OnChanges {
  @Input() htmlContent: FormControl = new FormControl();
  @Input() editable?: boolean;

  constructor(private changeDetector: ChangeDetectorRef) {}

  isLayoutReady = false;
  Editor = ClassicEditor;
  config: EditorConfig = {};

  ngOnChanges(changes: SimpleChanges) {
    if(changes['editable']) {
      this.checkIfEditable();
    }
  }

  private checkIfEditable(): void {
    this.editable ? this.htmlContent.enable() : this.htmlContent.disable();
  }

  ngAfterViewInit(): void {
    this.loadConfig();
    this.checkIfEditable();
    this.isLayoutReady = true;
    this.changeDetector.detectChanges();
  }

  private loadConfig(): void {
    this.config = {
      toolbar: {
        items: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          '|',
          'link',
          'insertImage',
          'insertTable',
          'highlight',
          'blockQuote',
          'codeBlock',
          '|',
          'alignment',
          '|',
          'outdent',
          'indent',
          'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
          'bulletedList',
          'numberedList',
          'todoList',
          'horizontalLine'
        ],
        shouldNotGroupWhenFull: true
      },
      plugins: [
        AccessibilityHelp,
        Alignment,
        Autoformat,
        AutoImage,
        Autosave,
        BlockQuote,
        Bold,
        CodeBlock,
        Essentials,
        Heading,
        Highlight,
        ImageBlock,
        ImageCaption,
        ImageInline,
        ImageInsert,
        ImageInsertViaUrl,
        ImageResize,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        LinkImage,
        List,
        ListProperties,
        Mention,
        Paragraph,
        PasteFromOffice,
        SelectAll,
        SimpleUploadAdapter,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        TextTransformation,
        TodoList,
        Underline,
        Undo,
        Base64UploadAdapter,
        Font,
        HorizontalLine
      ],
      heading: {
        options: [
          {
            model: 'paragraph',
            title: 'Paragraph',
            class: 'ck-heading_paragraph'
          },
          {
            model: 'heading1',
            view: 'h1',
            title: 'Heading 1',
            class: 'ck-heading_heading1'
          },
          {
            model: 'heading2',
            view: 'h2',
            title: 'Heading 2',
            class: 'ck-heading_heading2'
          },
          {
            model: 'heading3',
            view: 'h3',
            title: 'Heading 3',
            class: 'ck-heading_heading3'
          },
          {
            model: 'heading4',
            view: 'h4',
            title: 'Heading 4',
            class: 'ck-heading_heading4'
          },
          {
            model: 'heading5',
            view: 'h5',
            title: 'Heading 5',
            class: 'ck-heading_heading5'
          },
          {
            model: 'heading6',
            view: 'h6',
            title: 'Heading 6',
            class: 'ck-heading_heading6'
          }
        ]
      },
      image: {
        toolbar: [
          'toggleImageCaption',
          'imageTextAlternative',
          '|',
          'imageStyle:inline',
          'imageStyle:wrapText',
          'imageStyle:breakText',
          '|',
          'resizeImage'
        ]
      },
      language: 'es',
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        decorators: {
          toggleDownloadable: {
            mode: 'manual',
            label: 'Downloadable',
            attributes: {
              download: 'file'
            }
          }
        }
      },
      list: {
        properties: {
          styles: true,
          startIndex: true,
          reversed: true
        }
      },
      mention: {
        feeds: [
          {
            marker: '@',
            feed: [
              /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
            ]
          }
        ]
      },
      placeholder: 'Escriba su contenido aquí',
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
      },
      translations: [translations]
    };
  }
}
