import { Pet } from '../../models/base/pet/index';
import { revivePet } from '../../models/base/pet/pet.reviver';
import { Api, ApiClient, ApiTypes, computePiiParameterTokens, RequestBody, RequestMetadata } from '@ama-sdk/core';

export type FindPetsByStatusStatusEnum = 'available' | 'pending' | 'sold';
export interface AddPetRequestData {
  /** Create a new pet in the store */
  'Pet': Pet;
}
export interface DeletePetRequestData {
  /** Pet id to delete */
  'petId': number;
  /**  */
  'api_key'?: string;
}
export interface FindPetsByStatusRequestData {
  /** Status values that need to be considered for filter */
  'status'?: FindPetsByStatusStatusEnum;
}
export interface FindPetsByTagsRequestData {
  /** Tags to filter by */
  'tags'?: string[];
}
export interface GetPetByIdRequestData {
  /** ID of pet to return */
  'petId': number;
}
export interface UpdatePetRequestData {
  /** Update an existent pet in the store */
  'Pet': Pet;
}
export interface UpdatePetWithFormRequestData {
  /** ID of pet that needs to be updated */
  'petId': number;
  /** Name of pet that needs to be updated */
  'name'?: string;
  /** Status of pet that needs to be updated */
  'status'?: string;
}
/**
 * @Deprecated, please use AddPetRequestData
 */
export interface AddPet extends AddPetRequestData {}

/**
 * @Deprecated, please use DeletePetRequestData
 */
export interface DeletePet extends DeletePetRequestData {}

/**
 * @Deprecated, please use FindPetsByStatusRequestData
 */
export interface FindPetsByStatus extends FindPetsByStatusRequestData {}

/**
 * @Deprecated, please use FindPetsByTagsRequestData
 */
export interface FindPetsByTags extends FindPetsByTagsRequestData {}

/**
 * @Deprecated, please use GetPetByIdRequestData
 */
export interface GetPetById extends GetPetByIdRequestData {}

/**
 * @Deprecated, please use UpdatePetRequestData
 */
export interface UpdatePet extends UpdatePetRequestData {}

/**
 * @Deprecated, please use UpdatePetWithFormRequestData
 */
export interface UpdatePetWithForm extends UpdatePetWithFormRequestData {}

export class PetApi implements Api {

  /** API name */
  public static readonly apiName = 'PetApi';

  /** @inheritDoc */
  public readonly apiName = PetApi.apiName;

  /** Tokens of the parameters containing PII */
  public readonly piiParamTokens: { [key: string]: string } = computePiiParameterTokens([]);

  /** @inheritDoc */
  public client: ApiClient;

  /**
   * Initialize your interface
   * @param apiClient
   * @params apiClient Client used to process call to the API
   */
  constructor(apiClient: ApiClient) {
    this.client = apiClient;
  }

  /**
   * Add a new pet to the store
   * Add a new pet to the store
   * @param data Data to provide to the API call
   * @param metadata
   */
  public async addPet(data: AddPetRequestData, metadata?: RequestMetadata<'application/json' | 'application/xml' | 'application/x-www-form-urlencoded', 'application/xml' | 'application/json'>): Promise<Pet> {
    const getParams = this.client.extractQueryParams<AddPetRequestData>(data, [] as never[]);
    const metadataHeaderAccept = metadata?.headerAccept || 'application/json';
    const headers: { [key: string]: string | undefined } = {
      'Content-Type': metadata?.headerContentType || 'application/json',
      ...(metadataHeaderAccept ? {'Accept': metadataHeaderAccept} : {})
    };

    let body: RequestBody = '';
    body = data.Pet ? JSON.stringify(data.Pet) : '{}';
    const basePathUrl = `${this.client.options.basePath}/pet`;
    const tokenizedUrl = `${this.client.options.basePath}/pet`;
    const tokenizedOptions = this.client.tokenizeRequestOptions(tokenizedUrl, getParams, this.piiParamTokens, data);

    const options = await this.client.prepareOptions(basePathUrl, 'POST', getParams, headers, body || undefined, tokenizedOptions, metadata);
    const url = this.client.prepareUrl(options.basePath, options.queryParams);

    const ret = this.client.processCall<Pet>(url, options, ApiTypes.DEFAULT, PetApi.apiName, { 200: revivePet } , 'addPet');
    return ret;
  }

  /**
   * Deletes a pet
   * @param data Data to provide to the API call
   * @param metadata
   */
  public async deletePet(data: DeletePetRequestData, metadata?: RequestMetadata<string, 'application/xml' | 'application/json'>): Promise<string> {
    const getParams = this.client.extractQueryParams<DeletePetRequestData>(data, [] as never[]);
    const metadataHeaderAccept = metadata?.headerAccept || 'application/json';
    const headers: { [key: string]: string | undefined } = {
      'Content-Type': metadata?.headerContentType || 'application/json',
      ...(metadataHeaderAccept ? {'Accept': metadataHeaderAccept} : {}),
      'api_key': data.api_key
    };

    const body: RequestBody = '';
    const basePathUrl = `${this.client.options.basePath}/pet/${data.petId}`;
    const tokenizedUrl = `${this.client.options.basePath}/pet/${this.piiParamTokens.petId || data.petId}`;
    const tokenizedOptions = this.client.tokenizeRequestOptions(tokenizedUrl, getParams, this.piiParamTokens, data);

    const options = await this.client.prepareOptions(basePathUrl, 'DELETE', getParams, headers, body || undefined, tokenizedOptions, metadata);
    const url = this.client.prepareUrl(options.basePath, options.queryParams);

    const ret = this.client.processCall<string>(url, options, ApiTypes.DEFAULT, PetApi.apiName, { 200: undefined } , 'deletePet');
    return ret;
  }

  /**
   * Finds Pets by status
   * Multiple status values can be provided with comma separated strings
   * @param data Data to provide to the API call
   * @param metadata
   */
  public async findPetsByStatus(data: FindPetsByStatusRequestData, metadata?: RequestMetadata<string, 'application/xml' | 'application/json'>): Promise<Pet[]> {
    data.status = data.status !== undefined ? data.status : 'available';
    const getParams = this.client.extractQueryParams<FindPetsByStatusRequestData>(data, ['status']);
    const metadataHeaderAccept = metadata?.headerAccept || 'application/json';
    const headers: { [key: string]: string | undefined } = {
      'Content-Type': metadata?.headerContentType || 'application/json',
      ...(metadataHeaderAccept ? {'Accept': metadataHeaderAccept} : {})
    };

    const body: RequestBody = '';
    const basePathUrl = `${this.client.options.basePath}/pet/findByStatus`;
    const tokenizedUrl = `${this.client.options.basePath}/pet/findByStatus`;
    const tokenizedOptions = this.client.tokenizeRequestOptions(tokenizedUrl, getParams, this.piiParamTokens, data);

    const options = await this.client.prepareOptions(basePathUrl, 'GET', getParams, headers, body || undefined, tokenizedOptions, metadata);
    const url = this.client.prepareUrl(options.basePath, options.queryParams);

    const ret = this.client.processCall<Pet[]>(url, options, ApiTypes.DEFAULT, PetApi.apiName, { 200: revivePet } , 'findPetsByStatus');
    return ret;
  }

  /**
   * Finds Pets by tags
   * Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
   * @param data Data to provide to the API call
   * @param metadata
   */
  public async findPetsByTags(data: FindPetsByTagsRequestData, metadata?: RequestMetadata<string, 'application/xml' | 'application/json'>): Promise<Pet[]> {
    const getParams = this.client.extractQueryParams<FindPetsByTagsRequestData>(data, ['tags']);
    const metadataHeaderAccept = metadata?.headerAccept || 'application/json';
    const headers: { [key: string]: string | undefined } = {
      'Content-Type': metadata?.headerContentType || 'application/json',
      ...(metadataHeaderAccept ? {'Accept': metadataHeaderAccept} : {})
    };

    const body: RequestBody = '';
    const basePathUrl = `${this.client.options.basePath}/pet/findByTags`;
    const tokenizedUrl = `${this.client.options.basePath}/pet/findByTags`;
    const tokenizedOptions = this.client.tokenizeRequestOptions(tokenizedUrl, getParams, this.piiParamTokens, data);

    const options = await this.client.prepareOptions(basePathUrl, 'GET', getParams, headers, body || undefined, tokenizedOptions, metadata);
    const url = this.client.prepareUrl(options.basePath, options.queryParams);

    const ret = this.client.processCall<Pet[]>(url, options, ApiTypes.DEFAULT, PetApi.apiName, { 200: revivePet } , 'findPetsByTags');
    return ret;
  }

  /**
   * Find pet by ID
   * Returns a single pet
   * @param data Data to provide to the API call
   * @param metadata
   */
  public async getPetById(data: GetPetByIdRequestData, metadata?: RequestMetadata<string, 'application/xml' | 'application/json'>): Promise<Pet> {
    const getParams = this.client.extractQueryParams<GetPetByIdRequestData>(data, [] as never[]);
    const metadataHeaderAccept = metadata?.headerAccept || 'application/json';
    const headers: { [key: string]: string | undefined } = {
      'Content-Type': metadata?.headerContentType || 'application/json',
      ...(metadataHeaderAccept ? {'Accept': metadataHeaderAccept} : {})
    };

    const body: RequestBody = '';
    const basePathUrl = `${this.client.options.basePath}/pet/${data.petId}`;
    const tokenizedUrl = `${this.client.options.basePath}/pet/${this.piiParamTokens.petId || data.petId}`;
    const tokenizedOptions = this.client.tokenizeRequestOptions(tokenizedUrl, getParams, this.piiParamTokens, data);

    const options = await this.client.prepareOptions(basePathUrl, 'GET', getParams, headers, body || undefined, tokenizedOptions, metadata);
    const url = this.client.prepareUrl(options.basePath, options.queryParams);

    const ret = this.client.processCall<Pet>(url, options, ApiTypes.DEFAULT, PetApi.apiName, { 200: revivePet } , 'getPetById');
    return ret;
  }

  /**
   * Update an existing pet
   * Update an existing pet by Id
   * @param data Data to provide to the API call
   * @param metadata
   */
  public async updatePet(data: UpdatePetRequestData, metadata?: RequestMetadata<'application/json' | 'application/xml' | 'application/x-www-form-urlencoded', 'application/xml' | 'application/json'>): Promise<Pet> {
    const getParams = this.client.extractQueryParams<UpdatePetRequestData>(data, [] as never[]);
    const metadataHeaderAccept = metadata?.headerAccept || 'application/json';
    const headers: { [key: string]: string | undefined } = {
      'Content-Type': metadata?.headerContentType || 'application/json',
      ...(metadataHeaderAccept ? {'Accept': metadataHeaderAccept} : {})
    };

    let body: RequestBody = '';
    body = data.Pet ? JSON.stringify(data.Pet) : '{}';
    const basePathUrl = `${this.client.options.basePath}/pet`;
    const tokenizedUrl = `${this.client.options.basePath}/pet`;
    const tokenizedOptions = this.client.tokenizeRequestOptions(tokenizedUrl, getParams, this.piiParamTokens, data);

    const options = await this.client.prepareOptions(basePathUrl, 'PUT', getParams, headers, body || undefined, tokenizedOptions, metadata);
    const url = this.client.prepareUrl(options.basePath, options.queryParams);

    const ret = this.client.processCall<Pet>(url, options, ApiTypes.DEFAULT, PetApi.apiName, { 200: revivePet } , 'updatePet');
    return ret;
  }

  /**
   * Updates a pet in the store with form data
   * @param data Data to provide to the API call
   * @param metadata
   */
  public async updatePetWithForm(data: UpdatePetWithFormRequestData, metadata?: RequestMetadata<string, string>): Promise<never> {
    const getParams = this.client.extractQueryParams<UpdatePetWithFormRequestData>(data, ['name', 'status']);
    const metadataHeaderAccept = metadata?.headerAccept || '';
    const headers: { [key: string]: string | undefined } = {
      'Content-Type': metadata?.headerContentType || 'application/json',
      ...(metadataHeaderAccept ? {'Accept': metadataHeaderAccept} : {})
    };

    const body: RequestBody = '';
    const basePathUrl = `${this.client.options.basePath}/pet/${data.petId}`;
    const tokenizedUrl = `${this.client.options.basePath}/pet/${this.piiParamTokens.petId || data.petId}`;
    const tokenizedOptions = this.client.tokenizeRequestOptions(tokenizedUrl, getParams, this.piiParamTokens, data);

    const options = await this.client.prepareOptions(basePathUrl, 'POST', getParams, headers, body || undefined, tokenizedOptions, metadata);
    const url = this.client.prepareUrl(options.basePath, options.queryParams);

    const ret = this.client.processCall<never>(url, options, ApiTypes.DEFAULT, PetApi.apiName, undefined, 'updatePetWithForm');
    return ret;
  }

}
