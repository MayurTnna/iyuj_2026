import { useUniverseStore } from './store/universeStore';
import { Level0Gate } from './components/Level0Gate/Level0Gate';
import { Universe } from './universe/Universe';

function App() {
  const { chapter, enterUniverse } = useUniverseStore();

  if (chapter === 1) {
    return <Universe />;
  }

  return <Level0Gate onEnterUniverse={enterUniverse} />;
}

export default App;
