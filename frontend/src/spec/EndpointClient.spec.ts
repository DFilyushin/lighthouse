import ClientEndpoint from 'services/endpoints/clients'


describe('spec/EndpointClient.spec.ts', ()=> {
    it('Client Ok', ()=> {
        expect(ClientEndpoint.getClients()).toEqual('http://localhost:8000/clients');
        expect(ClientEndpoint.deleteClient(10)).toEqual('http://localhost:8000/client/10');
        expect(ClientEndpoint.newClient()).toEqual('http://localhost:8000/client');
        expect(ClientEndpoint.saveClient(10)).toEqual('http://localhost:8000/client/10')
        }
    )
});