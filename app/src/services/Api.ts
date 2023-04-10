/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CharacterInfo {
  name: string;
  class: string;
  /** @format int32 */
  level: number;
  race: string;
  background: string;
  playerName: string;
  alignment: string;
  /** @format int32 */
  experiencePoints: number;
}

export interface Ability {
  name: string;
  shortname: string;
  /** @format int32 */
  score: number;
  proficiency: boolean;
}

export interface General {
  /** @format int32 */
  inspiration: number;
  /** @format int32 */
  proficiencyBonus: number;
  /** @format int32 */
  speed: number;
}

export interface Skill {
  name: string;
  proficiency: boolean;
  expertise: boolean;
}

export interface Armor {
  type: string;
  shield: boolean;
}

export interface HealthPoints {
  /** @format int32 */
  maximum: number;
  /** @format int32 */
  current: number;
  /** @format int32 */
  temporary: number;
}

export interface HitDice {
  max: string;
  current: string;
}

export interface DeathSave {
  success: boolean[];
  failure: boolean[];
}

export interface Currency {
  /** @format int32 */
  copper: number;
  /** @format int32 */
  silver: number;
  /** @format int32 */
  electrum: number;
  /** @format int32 */
  gold: number;
  /** @format int32 */
  platinum: number;
}

export interface Equipment {
  name: string;
  /** @format int32 */
  amount: number;
}

export interface PIBF {
  personalityTraits: string;
  ideals: string;
  bonds: string;
  flaws: string;
}

export interface Attack {
  name: string;
  damage: string;
  damageType: string;
  finesse: boolean;
}

export interface Feature {
  name: string;
  description: string;
}

export interface Proficiencies {
  languages: string[];
  armor: string[];
  weapons: string[];
  tools: string[];
}

export interface Note {
  /** @format int32 */
  id: number;
  title: string;
  /** @format date-time */
  date: string;
  content: string;
}

export interface Sheet {
  /** @format int32 */
  id?: number;
  userId: string;
  characterInfo: CharacterInfo;
  abilities: Ability[];
  general: General;
  skills: Skill[];
  armor: Armor;
  healthPoints: HealthPoints;
  hitDice: HitDice;
  deathSave: DeathSave;
  currency: Currency;
  equipment: Equipment[];
  pibf: PIBF;
  attacks: Attack[];
  features: Feature[];
  proficiencies: Proficiencies;
  notes: Note[];
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseApiParams?: Omit<RequestParams, "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data.data;
    });
  };
}

/**
 * @title Swashbuckle
 * @version v1
 * @baseUrl http://localhost:7071
 *
 * Swagger document by Swashbuckle
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    deleteSheet: (
      userId: string,
      id: number,
      query?: {
        code?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/user/${userId}/sheets/${id}`,
        method: "DELETE",
        query: query,
        ...params,
      }),

    userSheets: (
      userId: string,
      query?: {
        code?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Sheet[], any>({
        path: `/api/user/${userId}/sheets`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    addUpdateSheet: (
      userId: string,
      sheetId?: number,
      body?: Sheet,
      params: RequestParams = {},
    ) =>
      this.request<Sheet, any>({
        path: `/api/user/${userId}/sheets/${sheetId ?? ''}`,
        method: "POST",
        body: body,
        format: "json",
        ...params,
      }),
  };
}
