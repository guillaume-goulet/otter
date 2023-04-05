# Placeholder component

The Otter framework provides a placeholder component mechanism to help integrate dynamic HTML elements (with a basic rendering system) at a predefined position in the application.

The placeholder component is exposed by the **@o3r/components** package and is working with the NgRX **placeholderTemplate** store exposed by the same package.

The component only has 1 input and supports a *content value*.

- The **id** input is required and will determine the unique identification for a specific placeholder component.
- The *content value* (or child nodes), if provided, will be used by the placeholder component as default display when no template has been found.

## How it works

Based on the **id** provided to the placeholder component, it will register itself to the event coming from **placeholderTemplate** and will display the template corresponding to its ID in the store.

> **note**: it is **strongly encouraged** to use the placeholder mechanism in concert with the [Rules Engine](../rules-engine/) following [this documentation](../rules-engine/how-to-use/placeholders.md).

## How to define a placeholder template

The placeholder template is defined in a JSON file following this JSON Schema [placeholder-template.schema.json](../../packages/@o3r/components/schemas/placeholder-template.schema.json).

Example:

```json
{
  "template": "<p>My fact : <%= myFact %></p>",
  "vars": {
    "myFact ": {
      "value": "myFact ",
      "type": "fact"
    }
  }
}
```

Then the JSON File can be downloaded and dispatched to the store as follows:

```typescript
import { setPlaceholderTemplateEntityFromUrl } from '@o3r/components';

const JsonFileUrl = 'url-to-the-json-file';

store.dispatch(setPlaceholderTemplateEntityFromUrl({
  call: (await fetch(JsonFileUrl)).json(),
  id: 'my-placeholder-template',
  resolvedUrl: JsonFileUrl,
  url: JsonFileUrl
}));
```

Or the object can be directly dispatched via the `setPlaceholderTemplateEntity` action.

## How to integrate a placeholder in the apps

The following steps should be followed in the application:

- Importing the `PlaceholderTemplateStoreModule` module in the application `AppModule`.
- Importing the `PlaceholderModule` module in the component using the placeholder in its template.

```typescript
import { PlaceholderModule } from '@o3r/components';

@NgModule({
  imports: [
    ...
    PlaceholderModule
  ],
...
})
export class MyComponentModule {}

@Component({
  selector: 'my-component',
  template: `<p>the placeholder:</p><o3r-placeholder messagePanel id="pl2358lv-2c63-42e1-b450-6aafd91fbae8">Placeholder loading ...</o3r-placeholder>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent { }
```
