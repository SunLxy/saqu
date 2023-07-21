import ReactDOM from 'react-dom/client';
import { SimplePreview } from 'simple-markdown-preview';
import './index.less';
ReactDOM.createRoot(document.getElementById('root')!).render(<SimplePreview path={() => import('saqu/README.md')} />);
