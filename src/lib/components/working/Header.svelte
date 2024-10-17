<script lang="ts">
</script>

<header>
	<div class="wrap">
		<ul>
			<li><button>그리기</button></li>
			<li><button>이동</button></li>
			<li><button>선택</button></li>
			<li><button>뒤로 가기</button></li>
			<li><button>앞으로 가기</button></li>
			<li><button>코멘트</button></li>
		</ul>
	</div>
</header>

<style lang="scss">
	header {
		background-color: #131313;
		color: #fff;

		.wrap {
			padding: 17px;
			ul {
				display: flex;
				justify-content: center;
				align-items: center;
				gap: 20px;

				button {
					color: #fff;
				}
			}
		}
	}
</style>
