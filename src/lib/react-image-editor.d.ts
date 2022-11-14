declare module '@toast-ui/react-image-editor' {
  import ImageEditor from 'tui-image-editor';

  type BaseProps = ConstructorParameters<typeof ImageEditor>[1];

  // export default function BaseImageEditor(props: BaseProps): JSX.Element;

  export default class ImageEditorComponent extends React.Component<BaseProps> {
    getInstance: () => ImageEditor
  }
}