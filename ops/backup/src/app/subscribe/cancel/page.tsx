export const dynamic = 'force-static';
export default function Cancel(){
  return (
    <main style={{minHeight:'100svh',display:'grid',placeItems:'center',background:'#0b0b0b',color:'#fff'}}>
      <div style={{textAlign:'center'}}>
        <h1 style={{fontSize:28,fontWeight:800,marginBottom:12}}>Checkout Cancelled</h1>
        <p style={{opacity:.85}}>You can return to subscribe anytime.</p>
      </div>
    </main>
  );
}
