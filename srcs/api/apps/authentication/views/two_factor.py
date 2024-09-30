from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from apps.authentication.serializers import TwoFASerializer

class   TwoFaBaseView(GenericAPIView):
    serializer_class = TwoFASerializer
    context = {'action': 'enable'}
    
    def post(self, request):
        self.context['request'] = request
        serializer = self.serializer_class(
            data=request.data,
            context=self.context,
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

class   Enable2FaView(TwoFaBaseView):
    context = {'action': 'disable'}

class   Disable2FaView(TwoFaBaseView):
    context = {'action': 'disable'}

