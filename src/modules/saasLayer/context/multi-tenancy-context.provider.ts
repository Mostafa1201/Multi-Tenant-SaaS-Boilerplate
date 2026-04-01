import { ContextId, ContextIdFactory, ContextIdStrategy, HostComponentInfo } from '@nestjs/core';

const tenants = new Map<string, ContextId>();

export class AggregateByTenantContextIdStrategy implements ContextIdStrategy {
  attach(contextId: ContextId, request: any) {
    const tenantId = request.headers['x-tenant-id'] as string;

    let tenantSubTreeId: ContextId;
    if (tenants.has(tenantId)) {
      tenantSubTreeId = tenants.get(tenantId);
    } else {
      tenantSubTreeId = ContextIdFactory.create();
      tenants.set(tenantId, tenantSubTreeId);
    }

    // Attach the tenantId to the request for later use
    request.tenantId = tenantId;

    return {
      resolve: (info: HostComponentInfo) => (info.isTreeDurable ? tenantSubTreeId : contextId),
      payload: { tenantId }
    };
  }
}
