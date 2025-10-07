# Universal Data Renderer

A flexible React component for rendering structured data with automatic layout detection and formatting.

## Features

- **Automatic Layout Detection**: Intelligently chooses between tables, lists, and nested sections based on data structure and size
- **Hierarchical Rendering**: Supports main sections, subsections, and subsubsections
- **Link Detection**: Automatically detects and renders URLs as clickable links
- **Appendix Integration**: Integrates with existing AppendixLink component for cross-references
- **Responsive Design**: Uses Tailwind CSS for consistent styling

## Usage

```tsx
import UniversalDataRenderer from './UniversalDataRenderer';

const MyComponent = () => {
  const data = {
    // Small objects render as tables
    basicInfo: {
      name: "Example",
      type: "Component",
      version: "1.0"
    },

    // Arrays render as lists
    features: [
      "Automatic layout",
      "Responsive design",
      "TypeScript support"
    ],

    // Large objects render as subsections
    detailedSpecs: {
      performance: {
        speed: "Fast",
        memory: "Efficient"
      },
      compatibility: {
        browsers: ["Chrome", "Firefox", "Safari"],
        platforms: ["Web", "Mobile"]
      }
    }
  };

  return (
    <UniversalDataRenderer
      data={data}
      title="Component Documentation"
      sectionId="section-1"
      maxTableSize={10} // Objects with ≤10 keys show as tables
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any` | - | The data to render |
| `title` | `string` | - | Section title (only shown for main sections) |
| `sectionId` | `string` | - | HTML id for the section (enables navigation) |
| `level` | `number` | `0` | Nesting level (0=main, 1=subsection, 2=subsubsection) |
| `maxTableSize` | `number` | `10` | Max keys for table display vs subsections |
| `className` | `string` | `''` | Additional CSS classes |

## Data Structure Guidelines

### Tables (Small Objects)
Objects with ≤ `maxTableSize` valid keys render as key-value tables:
```tsx
{
  name: "Product",
  price: "$99",
  category: "Electronics"
}
```

### Lists (Arrays)
Arrays render as bulleted lists:
```tsx
["Feature 1", "Feature 2", "Feature 3"]
```

### Subsections (Large Objects)
Objects with > `maxTableSize` valid keys render as nested subsections:
```tsx
{
  section1: { /* data */ },
  section2: { /* data */ },
  section3: { /* data */ }
}
```

### Links and References
- URLs are automatically detected and rendered as links
- Text containing "Appendix" or similar patterns link to appendices
- Null/undefined/"n/a" values are filtered out

## Integration

Works seamlessly with existing ChemBank2 components:
- Uses `KeyValueTable` for tabular data
- Uses `AppendixLink` for cross-references
- Follows existing styling patterns
- Compatible with navigation systems

## Demo

See `UniversalTemplateDemo.tsx` for comprehensive examples of different data structures and rendering behaviors.