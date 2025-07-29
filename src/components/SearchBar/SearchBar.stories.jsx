import SearchBar from './SearchBar';

export default {
  title: 'SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
};

export function SearchBarComponent(args) {
  return (
    <div style={{ width: '344px' }}>
      <SearchBar {...args} />
    </div>
  );
}

SearchBarComponent.args = {
  placeholder: 'Search Tasks...',
  onSearch: (searchText) => console.log(`Searching ${searchText}`),
  fontSize: '2rem',
  iconSize: '2.4rem',
};
