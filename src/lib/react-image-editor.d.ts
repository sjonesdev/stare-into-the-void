declare module '@toast-ui/react-image-editor' {
  import ImageEditor from 'tui-image-editor';

  type BaseProps = ConstructorParameters<typeof ImageEditor>[1];

  // export default function BaseImageEditor(props: BaseProps): JSX.Element;

  interface ImageEditorProps extends BaseProps {
    ref: React.RefObject
  }

  export default function ReactImageEditor(props: ImageEditorProps): JSX.Element
}