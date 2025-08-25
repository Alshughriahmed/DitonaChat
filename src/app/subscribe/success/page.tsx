export const dynamic = 'force-static';
export default function Success(){
  return (
    <main style={{minHeight:'100svh',display:'grid',placeItems:'center',background:'#0b0b0b',color:'#fff'}}>
      <div style={{textAlign:'center'}}>
        <h1 style={{fontSize:28,fontWeight:800,marginBottom:12}}>Payment Successful</h1>
        <p style={{opacity:.85}}>Thank you! Your VIP will be activated after webhook processing.</p>
      </div>
    </main>
  );
}
