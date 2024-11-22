import { inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";

export function queryParamSignal(queryParam: string) {
    const activatedRoute = inject(ActivatedRoute);
    return toSignal<string>(activatedRoute.queryParams.pipe(map((v) => v[queryParam])), { initialValue: activatedRoute.snapshot.queryParams[queryParam] });
}

export function routeParamsSignal(param: string) {
    const activatedRoute = inject(ActivatedRoute);
    return toSignal<string>(activatedRoute.params.pipe(map((v) => v[param])), { initialValue: activatedRoute.snapshot.params[param] });
}